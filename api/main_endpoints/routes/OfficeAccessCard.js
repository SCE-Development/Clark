const {
  UNAUTHORIZED,
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  OK,
} = require('../../util/constants').STATUS_CODES;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const OfficeAccessCard = require('../models/OfficeAccessCard.js');
const logger = require('../../util/logger');
const { officeAccessCard = {} } = require('../../config/config.json');
const { API_KEY = 'NOTHING_REALLY' } = officeAccessCard;
const { decodeTokenFromBodyOrQuery } = require('../util/token-functions.js');

router.use(bodyParser.json());

function checkIfCardExists(cardBytes) {
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.findOneAndUpdate(
        { cardBytes:cardBytes},
        {
          $inc: { verifiedCount: 1 },
          $set: { lastVerified: Date.now() }
        }, {
          useFindAndModify: false, new:true, upsert:false
        }
        , (error, result) => {
          if (error) {
            logger.error('checkIfCardExists got an error querying mongodb: ', error);
            return resolve(false);
          }
          if(!result){
            logger.info(`Card:${cardBytes} not found in the database`);
            return resolve(false);
          }
          return resolve(!!result);
        });
    } catch (error) {
      logger.error('checkIfCardExists caught an error: ', error);
      return resolve(false);
    }
  });
}

let clients = [];

const writeRequestResponse = (endpoint, statusCode, message) => {
  console.log('reached inside writeRequestResponse');
  response = {
    endpoint: endpoint,
    statusCode: statusCode,
    message: message,
  };
  console.log('now sending to clients');
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(response)}\n\n`);
  });
};

router.get('/verify', async (req, res) =>{
  const { cardBytes, add = false } = req.query;
  const apiKey = req.headers['x-api-key'];
  const required = [
    { value: apiKey, title: 'X-API-Key HTTP header', },
    { value: cardBytes, title: 'cardBytes query parameter', },
  ];

  const missingValue = required.find(({ value }) => !value);

  if (missingValue) {
    writeRequestResponse('/verify', BAD_REQUEST, `${missingValue.title} missing from request`);
    return res.status(BAD_REQUEST).send(` ${missingValue.title} missing from request`);
  }

  if (apiKey !== API_KEY) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardExists = await checkIfCardExists(cardBytes);
  if (cardExists) {
    writeRequestResponse('/verify', OK, 'Card authorized!');
    return res.sendStatus(OK);
  }
  // if a card doesnt exist and we arent trying
  // to add a new one, that means we were trying
  // to verify a card, and that card isnt found.
  // therefore return a non OK status
  if (!add) {
    writeRequestResponse('/verify', NOT_FOUND, 'Card not found');
    return res.sendStatus(NOT_FOUND);
  }

  try {
    if (add) {
      logger.info('adding a new card');
      await new OfficeAccessCard({
        cardBytes
      }).save();
      writeRequestResponse('/verify?add=1', OK, 'Card added!');
      return res.sendStatus(OK);
    }
  } catch (error) {
    logger.error('Error creating OfficeAccessCard: ', error);
    writeRequestResponse('/verify?add=1', SERVER_ERROR, `Error creating Office AccessCard: ${error}`);
    return res.sendStatus(SERVER_ERROR);
  }
});

router.get('/listen', async (req, res) => {
  if (!await decodeTokenFromBodyOrQuery(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no'
  };

  res.writeHead(OK, headers);

  const newClient = { res };
  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter(c => c !== newClient);
    res.end();
  });
});

module.exports = router;
