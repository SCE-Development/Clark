const {
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST,
  SERVER_ERROR
} = require('../../util/constants').STATUS_CODES;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User.js');
const logger = require('../../util/logger');

router.use(bodyParser.json());

const clients = {};

const writeMessage = ((roomId, message) => {
  if (clients[roomId]) {
    clients[roomId].forEach(client => client.res.write(`data: ${JSON.stringify(message)}\n\n`));
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

  await User.findOne({apiKey}, (error, result) => {
    if (error) {
      logger.error('Messages API endpoint /send had an error: ', error);
      res.sendStatus(SERVER_ERROR);
      return;
    }
    if (result) {
      writeMessage(id, message);
      return res.json({status: 'Message sent'});
    }
    return res.sendStatus(UNAUTHORIZED);
  });
});

router.get('/listen', async (req, res) => {
  const {apiKey, id} = req.query;

  const required = [
    {value: apiKey, title: 'API Key', },
    {value: id, title: 'Room ID', }
  ];

  const missingValue = required.find(({value}) => !value);

  if (missingValue){
    res.status(BAD_REQUEST).send(`You must specify a ${missingValue.title}`);
    return;
  }

  await User.findOne({apiKey}, (error, result) => {
    if (error) {
      logger.error('Messages API endpoint /listen had an error: ', error);
      res.sendStatus(SERVER_ERROR);
      return;
    }
    if (result) {
      const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      };

      res.writeHead(200, headers);

      if(!clients[id]){
        clients[id] = [];
      }

      clients[id].push({res});

      req.on('close', () => {
        if(clients[id]){
          clients[id] = clients[id].filter(client => client !== res);
        }
        if(clients[id].length === 0){
          delete clients[id];
        }
      });
    }
    return res.sendStatus(UNAUTHORIZED);
  });
});

module.exports = router;
