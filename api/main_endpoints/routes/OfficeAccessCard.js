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

const response = {
  endpoint: '/verify',
  statusCode: 200,
  message: 'Card authorized!'
};

const writeRequestResponse = () => {
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
    response.statusCode = BAD_REQUEST;
    response.message = `${missingValue.title} missing from request`;
    writeRequestResponse();
    return res.status(BAD_REQUEST).send(` ${missingValue.title} missing from request`);
  }

  if (apiKey !== API_KEY) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardExists = await checkIfCardExists(cardBytes);
  if (cardExists) {
    response.endpoint = '/verify'; // if user tried to add a card that already existed, ignore the "add" parameter
    writeRequestResponse();
    return res.sendStatus(OK);
  }
  // if a card doesnt exist and we arent trying
  // to add a new one, that means we were trying
  // to verify a card, and that card isnt found.
  // therefore return a non OK status
  if (!add) {
    response.statusCode = NOT_FOUND;
    response.message = 'Card not found';
    writeRequestResponse();
    return res.sendStatus(NOT_FOUND);
  }

  response.endpoint = '/verify?add=1';

  try {
    if (add) {
      logger.info('adding a new card');
      await new OfficeAccessCard({
        cardBytes
      }).save();
      response.message = 'Card added!';
      response.statusCode = 200;
      writeRequestResponse();
      return res.sendStatus(OK);
    }
  } catch (error) {
    logger.error('Error creating OfficeAccessCard: ', error);
    response.message = 'Error creating OfficeAccessCard: ' + error;
    response.statusCode = SERVER_ERROR;
    writeRequestResponse();
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

  res.writeHead(200, headers);

  const newClient = { res };
  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter(c => c !== newClient);
    res.end();
  });
});

module.exports = router;
