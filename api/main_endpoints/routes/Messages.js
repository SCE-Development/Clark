const {
  UNAUTHORIZED,
  FORBIDDEN,
  SERVER_ERROR
} = require('../../util/constants').STATUS_CODES;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User.js');

router.use(bodyParser.json());

const clients = {};

const writeMessage = ((roomId, message) => {
  if (clients[roomId]) {
    clients[roomId].forEach(client => client.res.write(`data: ${JSON.stringify(message)}\n\n`));
  }
});

router.post('/send', async (req, res) => {

  const {apiKey, message, id} = req.body;

  let apiKeyFound = false;

  await User.findOne({apiKey}, (error, result) => {
    if (error) {
      res.sendStatus(SERVER_ERROR);
      return;
    }
    if (result) {
      apiKeyFound = true;
    }
  });

  if(!apiKey || !message || !id){
    res.sendStatus(FORBIDDEN);
    return;
  } else if (apiKeyFound === false) {
    res.sendStatus(UNAUTHORIZED);
    return;
  }
  writeMessage(id, message);
  return res.json({status: 'Message sent'});

});

router.get('/listen', async (req, res) => {
  const {apiKey, id} = req.query;

  let apiKeyFound = false;

  await User.findOne({apiKey}, (error, result) => {
    if (error) {
      res.sendStatus(SERVER_ERROR);
      return;
    }
    if (result) {
      apiKeyFound = true;
    }
  });

  if(!apiKey || !id){
    res.sendStatus(FORBIDDEN);
    return;
  } else if(apiKeyFound === false){
    res.sendStatus(UNAUTHORIZED);
    return;
  }

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

});

module.exports = router;
