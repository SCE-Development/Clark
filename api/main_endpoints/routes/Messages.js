const {
  UNAUTHORIZED,
  BAD_REQUEST,
  SERVER_ERROR,
  OK
} = require('../../util/constants').STATUS_CODES;
const { MAX_AMOUNT_OF_CONNECTIONS } = require('../../util/constants').MESSAGES_API;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User.js');
const logger = require('../../util/logger');
const client = require('prom-client');
const { decodeToken, decodeTokenFromBodyOrQuery } = require('../util/token-functions.js');
const { MetricsHandler, register } = require('../../util/metrics.js');
const axios = require('axios');

router.use(bodyParser.json());



const clients = {};
const numberOfConnections = {};
const lastMessageSent = {};

async function isImgUrl(url) {
  try {
    const res = await axios.head(url);
    return res.headers['content-type'].startsWith('image');
  } catch (error) {
    return false;
  }
}

const writeMessage = async (roomId, message, username) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = message.match(urlRegex) || [];
  const imageUrls = await Promise.all(urls.map(async (url) => {
    return await isImgUrl(url) ? url : null;
  }))
    .catch(() => {
      return [];
    });

  const messageObj = {
    timestamp: Date.now(),
    message,
    username,
    imageUrls: imageUrls?.filter(url => url !== null),
  };

  if (clients[roomId]) {
    clients[roomId].forEach(res => res.write(`data: ${JSON.stringify(messageObj)}\n\n`));
  }

  lastMessageSent[roomId] = JSON.stringify(messageObj);

  // increase the total messages sent counter
  MetricsHandler.totalMessagesSent.inc();

  // increase the total amount of messages sent per chatroom counter
  MetricsHandler.totalChatMessagesPerChatRoom.labels(roomId).inc();
};

router.post('/send', async (req, res) => {

  const {message, id} = req.body;
  const token = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];


  const required = [
    {value: token || apiKey, title: 'Token or API Key', },
    {value: message, title: 'Message', },
    {value: id, title: 'Room ID', },
  ];

  const missingValue = required.find(({value}) => !value);

  if (missingValue){
    res.status(BAD_REQUEST).send(`You must specify a ${missingValue.title}`);
    return;
  }

  let filterQuery = {}; // filter to find user in the database
  if (token) {
    userObj = decodeToken(req);
    if (!userObj) {
      return res.sendStatus(UNAUTHORIZED);
    }
    filterQuery._id = userObj._id;
  } else {
    filterQuery.apiKey = apiKey;
  }

  try {
    User.findOne(filterQuery, (error, result) => {
      if (error) {
        logger.error('/send received an invalid API key or token: ', error);
        res.sendStatus(SERVER_ERROR);
        return;
      }
      if (result) {
        writeMessage(id, `${message}`, `${result.firstName}:`);
        return res.json({status: 'Message sent'});
      }
      return res.sendStatus(UNAUTHORIZED);
    });
  } catch (error) {
    logger.error('Error in /send: ', error);
    res.sendStatus(SERVER_ERROR);
  }
});

router.get('/getLatestMessage', async (req, res) => {
  const {apiKey, id} = req.query;

  const required = [
    {value: apiKey, title: 'API Key'},
    {value: id, title: 'Room ID'},
  ];

  const missingValue = required.find(({value}) => !value);

  if (missingValue){
    res.status(BAD_REQUEST).send(`You must specify a ${missingValue.title}`);
    return;
  }

  try {
    User.findOne({ apiKey }, (error, result) => {
      if (error) {
        logger.error('/listen received an invalid API key: ', error);
        res.sendStatus(SERVER_ERROR);
        return;
      }

      if (!result) { // return unauthorized if no api key found
        return res.sendStatus(UNAUTHORIZED);
      }

      if (!lastMessageSent[id]) {
        return res.status(OK).send('Room closed');
      }

      return res.status(OK).send(lastMessageSent[id]);

    });
  } catch (error) {
    logger.error('Error in /get: ', error);
    res.sendStatus(SERVER_ERROR);
  }
});

router.get('/listen', async (req, res) => {

  const {token, apiKey, id} = req.query;

  const required = [
    {value: token || apiKey, title: 'Token or API Key', },
    {value: id, title: 'Room ID', }
  ];

  const missingValue = required.find(({value}) => !value);

  if (missingValue){
    res.status(BAD_REQUEST).send(`You must specify a ${missingValue.title}`);
    return;
  }

  let filterQuery = {}; // filter to find user in the database
  if (token) {
    let userObj = decodeTokenFromBodyOrQuery(req);
    if (!userObj) {
      return res.sendStatus(UNAUTHORIZED);
    }
    filterQuery._id = userObj._id;
  } else {
    filterQuery.apiKey = apiKey;
  }

  try {
    User.findOne(filterQuery, (error, result) => {
      if (error) {
        logger.error('/listen received an invalid API key: ', error);
        res.sendStatus(SERVER_ERROR);
        return;
      }

      if (!result || (numberOfConnections[result._id] && numberOfConnections[result._id] >= MAX_AMOUNT_OF_CONNECTIONS)) { // no api key found or 3 connections per api key; unauthorized
        return res.sendStatus(UNAUTHORIZED);
      }

      const { _id } = result;

      numberOfConnections[_id] = numberOfConnections[_id] ? numberOfConnections[_id] + 1 : 1;

      const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no'
      };

      res.writeHead(200, headers);
      req.setTimeout(0);

      if(!clients[id]){
        clients[id] = [];
      }

      // add connection to the connections open gauge
      MetricsHandler.currentConnectionsOpen.labels(id).inc();

      clients[id].push(res);

      req.on('close', () => {
        if(clients[id]){
          MetricsHandler.currentConnectionsOpen.labels(id).dec();
          clients[id] = clients[id].filter(client => client !== res);
        }
        if(clients[id].length === 0){
          delete clients[id];
          delete lastMessageSent[id];
          MetricsHandler.currentConnectionsOpen.remove({ id });
        }
        numberOfConnections[_id] -= 1;
      });
    });
  } catch (error) {
    logger.error('Error in /listen: ', error);
    res.sendStatus(SERVER_ERROR);
  }
});


// to get prometheus metrics
router.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// heartbeat mechanism to bypass NGINX timeout
setInterval(() => {
  Object.keys(clients).forEach(roomId => {
    clients[roomId].forEach(res => res.write('heartbeat:\n\n'));
  });
}, 45000);

module.exports = router;
