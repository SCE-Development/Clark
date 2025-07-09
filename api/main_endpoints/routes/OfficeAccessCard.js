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
const { ADJECTIVES, NOUNS } = require('../../util/CardReaderConstants.js');

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
            return resolve(false);
          }
          return resolve(result); // return the document
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

function checkIfAliasExists(alias) {
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.findOne(
        { alias }
        , (error, result) => {
          if (error) {
            logger.error('checkIfAliasExists got an error querying mongodb: ', error);
            return resolve(false);
          }
          if(!result){
            logger.info(`Card with alias \"${alias}\" not found in the database`);
          }
          return resolve(!!result);
        }
      );
    } catch (error) {
      logger.error('checkIfAliasExists caught an error: ', error);
      return resolve(false);
    }
  });
}

async function generateAlias() {
  let aliasExists = true;
  let alias = '';
  while (aliasExists) { // keep generating until unique alias generated
    let noun = NOUNS[Math.floor(Math.random() * 100)]; // change this number later if/when list size grows
    let adjective = ADJECTIVES[Math.floor(Math.random() * 100)];
    alias = `${adjective} ${noun}`;
    aliasExists = await checkIfAliasExists(alias);
  }
  return alias;
}

let clients = [];

const defaultGetResponse = {
  message: 'Card authorized!',
  endpoint: '/verify',
  requestType: 'GET',
  alias: 'N/A',
};

const defaultPostResponse = {
  message: 'Card deleted!',
  endpoint: '/delete',
  requestType: 'POST',
  alias: 'N/A',
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

router.get('/verify', async (req, res) => {
  const { cardBytes, add = false } = req.query;
  const apiKey = req.headers['x-api-key'];
  const required = [
    { value: apiKey, title: 'X-API-Key HTTP header', },
    { value: cardBytes, title: 'cardBytes query parameter', },
  ];

  const missingValue = required.find(({ value }) => !value);

  if (missingValue) {
    return res.status(BAD_REQUEST).send(`${missingValue.title} missing from request`);
  }

  if (apiKey !== API_KEY) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardExists = await checkIfCardExists(cardBytes);
  if (cardExists) {
    writeLogToClient(req.method, { alias: cardExists.alias, statusCode: OK });
    return res.sendStatus(OK);
  }
  // if a card doesnt exist and we arent trying
  // to add a new one, that means we were trying
  // to verify a card, and that card isnt found.
  // therefore return a non OK status
  if (!add) {
    writeLogToClient(req.method, { alias: 'none', statusCode: NOT_FOUND, message: 'Card not found' });
    return res.sendStatus(NOT_FOUND);
  }
  // if we reached here, the card does not exist and is trying to be added
  const alias = await generateAlias();
  try {
    logger.info('adding a new card');
    await new OfficeAccessCard({
      cardBytes,
      alias,
    }).save();
    writeLogToClient(req.method, {
      alias,
      statusCode: OK,
      message: 'Card added!',
      endpoint: '/verify?add=1'
    });
    return res.sendStatus(OK);
  } catch (error) {
    logger.error('Error creating OfficeAccessCard: ', error);
    writeLogToClient(req.method, {
      alias,
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

  const cardExists = await checkIfCardExists(cardBytes);
  if (!cardExists) {
    logger.info('Card does not exist');
    writeLogToClient(req.method, {
      statusCode: NOT_FOUND,
      message: 'Card does not exist',
    });
    return res.sendStatus(NOT_FOUND);
  }

  if (await deleteCard(cardBytes)) { // successful
    logger.info('Successfully deleted card');
    writeLogToClient(req.method, {
      alias: cardExists.alias,
      statusCode: OK,
    });
    return res.sendStatus(OK);
  }
  logger.info('Error deleting card');
  writeLogToClient({
    alias: cardExists.alias,
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

  let skip = Math.max(Number(req.body.page) || 0, 0) * ROWS_PER_PAGE;

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
