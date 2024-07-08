const {
  UNAUTHORIZED,
  BAD_REQUEST,
  SERVER_ERROR
} = require('../../util/constants').STATUS_CODES;
const { MAX_AMOUNT_OF_CONNECTIONS } = require('../../util/constants').MESSAGES_API;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User.js');
const logger = require('../../util/logger');
const { verifyToken } = require('../../util/token-verification.js');
const { decodeToken } = require('../util/token-functions.js');


router.use(bodyParser.json());

const clients = {};
const numberOfConnections = {};

const writeMessage = ((roomId, message) => {
  if (clients[roomId]) {
    clients[roomId].forEach(res => res.write(`data: ${JSON.stringify(message)}\n\n`));
  }
});

router.post('/send', async (req, res) => {

  const {apiKey, message, id} = req.body;

  const required = [
    {value: apiKey, title: 'API Key', },
    {value: message, title: 'Message', },
    {value: id, title: 'Room ID', },
  ];

  const missingValue = required.find(({value}) => !value);

  if (missingValue){
    res.status(BAD_REQUEST).send(`You must specify a ${missingValue.title}`);
    return;
  }

  try {
    User.findOne({apiKey}, (error, result) => {
      if (error) {
        logger.error('/send received an invalid API key: ', error);
        res.sendStatus(SERVER_ERROR);
        return;
      }
      if (result) {
        writeMessage(id, message);
        return res.json({status: 'Message sent'});
      }
      return res.sendStatus(UNAUTHORIZED);
    });
  } catch (error) {
    logger.error('Error in /send: ', error);
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
    userObj = await decodeToken(req);
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
      };

      res.writeHead(200, headers);

      if(!clients[id]){
        clients[id] = [];
      }

      clients[id].push(res);

      req.on('close', () => {
        if(clients[id]){
          clients[id] = clients[id].filter(client => client !== res);
        }
        if(clients[id].length === 0){
          delete clients[id];
        }
        numberOfConnections[_id] -= 1;
      });
    });
  } catch (error) {
    logger.error('Error in /listen: ', error);
    res.sendStatus(SERVER_ERROR);
  }
});

module.exports = router;
