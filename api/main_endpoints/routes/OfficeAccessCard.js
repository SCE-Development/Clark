const {
  UNAUTHORIZED,
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  OK,
  FORBIDDEN,
} = require('../../util/constants').STATUS_CODES;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const OfficeAccessCard = require('../models/OfficeAccessCard.js');
const logger = require('../../util/logger');
const { officeAccessCard = {} } = require('../../config/config.json');
const { API_KEY = 'NOTHING_REALLY' } = officeAccessCard;
const {
  decodeTokenFromBodyOrQuery,
  decodeToken,
  checkIfTokenSent,
  checkIfTokenValid
} = require('../util/token-functions.js');
const ROWS_PER_PAGE = 25;

router.use(bodyParser.json());

function checkIfCardExists(cardBytes) {
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.findOneAndUpdate(
        { cardBytes },
        {
          $inc: { verifiedCount: 1 },
          $set: { lastVerified: Date.now() }
        }, {
          useFindAndModify: false, new: true, upsert: false
        }
        , (error, result) => {
          if (error) {
            logger.error('checkIfCardExists got an error querying mongodb: ', error);
            return resolve(false);
          }
          if (!result) {
            logger.info(`Card:${cardBytes} not found in the database`);
          }
          return resolve(!!result);
        });
    } catch (error) {
      logger.error('checkIfCardExists caught an error: ', error);
      return resolve(false);
    }
  });
}

function deleteCard(cardBytes) {
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.findOneAndDelete(
        { cardBytes }
        , (error, result) => {
          if (error) {
            logger.error('deleteCard got an error querying mongodb: ', error);
            return resolve(false);
          }
          if (!result) {
            logger.info(`Card ${cardBytes} not found in the database`);
          }
          return resolve(!!result);
        }
      );
    } catch (error) {
      logger.error('deleteCard caught an error: ', error);
      return resolve(false);
    }
  });
}

function getAllCards() {
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.find(
        {}
        , (error, result) => {
          if (error) {
            logger.error('getAllCards got an error querying mongodb');
            return resolve(null);
          }
          if (!result) {
            logger.info('Could not retrieve any cards from mongodb'); // double check that this is a correct message
          }
          return resolve(result);
        }
      );
    } catch (error) {
      logger.error('getAllCards caught an error: ', error);
      return resolve(null);
    }
  });
}

let clients = [];

const defaultGetResponse = {
  message: 'Card authorized!',
  endpoint: '/verify',
  requestType: 'GET',
};

const defaultPostResponse = {
  message: 'Card deleted!',
  endpoint: '/delete',
  requestType: 'POST',
};

const writeLogToClient = (requestType, { statusCode, ...rest }) => {
  let response = {};
  if (requestType === 'GET') {
    response = {
      statusCode,
      ...defaultGetResponse,
      ...rest,
    };
  } else {
    response = {
      statusCode,
      ...defaultPostResponse,
      ...rest,
    };
  }
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
    writeLogToClient(req.method, { statusCode: BAD_REQUEST, message: `${missingValue.title} missing from request` });
    return res.status(BAD_REQUEST).send(` ${missingValue.title} missing from request`);
  }

  if (apiKey !== API_KEY) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardExists = await checkIfCardExists(cardBytes);
  if (cardExists) {
    writeLogToClient(req.method, { statusCode: OK });
    return res.sendStatus(OK);
  }
  // if a card doesnt exist and we arent trying
  // to add a new one, that means we were trying
  // to verify a card, and that card isnt found.
  // therefore return a non OK status
  if (!add) {
    writeLogToClient(req.method, { statusCode: NOT_FOUND, message: 'Card not found' });
    return res.sendStatus(NOT_FOUND);
  }
  // if we reached here, the card does not exist and is trying to be added
  try {
    logger.info('adding a new card');
    await new OfficeAccessCard({
      cardBytes,
    }).save();
    writeLogToClient(req.method, { statusCode: OK, message: 'Card added!', endpoint: '/verify?add=1' });
    return res.sendStatus(OK);
  } catch (error) {
    logger.error('Error creating OfficeAccessCard: ', error);
    writeLogToClient(req.method, {
      statusCode: SERVER_ERROR,
      endpoint: '/verify?add=1',
      message: `Error creating Office AccessCard: ${error}`
    });
    return res.sendStatus(SERVER_ERROR);
  }
});

router.post('/delete', async (req, res) => {
  if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const { cardBytes } = req.body;
  if (!cardBytes) {
    writeLogToClient(req.method, {
      statusCode: BAD_REQUEST,
      message: 'cardBytes missing from request',
      requestType: req.method,
    });
    return res.sendStatus(BAD_REQUEST);
  }

  if (!await checkIfCardExists(cardBytes)) {
    logger.info('Card does not exist');
    writeLogToClient(req.method, {
      statusCode: NOT_FOUND,
      message: 'Card does not exist',
      requestType: req.method,
    });
    return res.sendStatus(NOT_FOUND);
  }

  if (await deleteCard(cardBytes)) { // successful
    logger.info('Successfully deleted card');
    writeLogToClient(req.method, {
      statusCode: OK,
      message: 'Card deleted!',
    });
    return res.sendStatus(OK);
  }
  writeLogToClient({
    statusCode: SERVER_ERROR,
    message: 'Error deleting card',
  });
  return res.sendStatus(SERVER_ERROR);
});

router.post('/getAllCards', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const skip = Math.max(Number(req.body.page) || 0, 0) * ROWS_PER_PAGE;

  try {
    const total = await OfficeAccessCard.count({});
    const items = await OfficeAccessCard.find({}, {}, { skip, limit: ROWS_PER_PAGE });
    return res.status(OK).send({
      items,
      total,
      rowsPerPage: ROWS_PER_PAGE,
    });
  } catch (error) {
    logger.error('Error fetching cards: ', error);
    return res.sendStatus(SERVER_ERROR);
  }
});

router.get('/getAllCards', async (req, res) => {
  if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  let getCards = await getAllCards();
  if (!getCards) {
    logger.info('Error retrieving cards');
    return res.sendStatus(SERVER_ERROR);
  }

  logger.info('Retrieved all cards successfully!');
  res.json(getCards).status(OK);
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
