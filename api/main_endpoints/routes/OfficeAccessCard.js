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
const {
  checkIfCardExists,
  generateAlias,
  deleteCard,
} = require('../util/OfficeAccessCard.js');


const { decodeToken, checkIfTokenValid, checkIfTokenSent, decodeTokenFromBodyOrQuery } = require('../util/token-functions.js');

router.use(bodyParser.json());

// writes a log with something
let clients = []
function writeLog(logResponse='endpoint verified', requestType='UNKNOWN', responseCode=200, endpoint='none') {
    const response = {
        requestTime: new Date().toISOString(),
        endpoint: endpoint,
        requestType: requestType,
        responseCode: responseCode,
        logResponse: logResponse
    };

    clients.forEach((client) => {
        client.res.write(`data: ${JSON.stringify(response)}\n\n`);
    });
};

router.get('/verify', async (req, res) => {

  const { cardBytes, add = false } = req.query;
  const apiKey = req.headers['x-api-key'];
  const required = [
    { value: apiKey, title: 'X-API-Key HTTP header', },
    { value: cardBytes, title: 'cardBytes body parameter', },
  ];



  const missingValue = required.find(({ value }) => !value);

  if (missingValue) { 
    writeLog(`missing value: ${missingValue.title}`, req.method, BAD_REQUEST);
    return res.status(BAD_REQUEST).send(` ${missingValue.title} missing from request`);
  }

  if (apiKey !== API_KEY) {
    writeLog('incorrect api key', req.method, UNAUTHORIZED, req.originalUrl);
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardExists = await checkIfCardExists(cardBytes);
  if (cardExists) {
    writeLog(`card ${cardBytes} already exists`, req.method, OK, req.originalUrl);
    return res.sendStatus(OK);

  }
  // if a card doesnt exist and we arent trying
  // to add a new one, that means we were trying
  // to verify a card, and that card isnt found.
  // therefore return a non OK status
  if (!add) {
    writeLog(`card ${cardBytes} not found`, req.method, NOT_FOUND, req.originalUrl);
    return res.sendStatus(NOT_FOUND);
  }
  // if we reached here, the card does not exist and is trying to be added
  const alias = await generateAlias();
  try {
    if (add) {
      await new OfficeAccessCard({
        cardBytes
      }).save();
      writeLog(`card ${cardBytes} found`, req.method, OK, req.originalUrl);
      return res.sendStatus(OK);
    }
  } catch (error) {
    logger.error('Error creating OfficeAccessCard: ', error);
    writeLog('server error', req.method, SERVER_ERROR, req.originalUrl);
    return res.sendStatus(SERVER_ERROR);
  }
});

router.get('/listen', async (req, res) => {

    if (!decodeTokenFromBodyOrQuery(req)) {
        return res.sendStatus(UNAUTHORIZED);
    }


    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    };

    res.writeHead(200, headers);
    req.setTimeout(0);

    req.on('close', () => {
        clients = clients.filter(c => c !== newClient);
        res.end();
    });

    const newClient = { res };
    clients.push(newClient);
});

router.get('/getAllCards', async (req, res) => {

  if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  
  const missingValue = required.find(({ value }) => !value);

  if (missingValue) {
    writeLog(`missing value: ${missingValue.title}`, req.method, BAD_REQUEST);
    return res.status(BAD_REQUEST).send(` ${missingValue.title} missing from request`);
  }


  OfficeAccessCard.find()
    .then(items => res.send(items))
    .catch(error => {
        res.sendStatus(BAD_REQUEST);
        res.writeLog('Bad Request', req.method, BAD_REQUEST, req.originalUrl);
    });
});

router.post('/delete', async (req, res) => {

  if (!decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardBytes = req.body.cardBytes;
  const required = [
    { value: cardBytes, title: 'cardBytes body parameter', },
  ];
  const missingValue = required.find(({ value }) => !value);

  if (missingValue) {
    writeLog(`missing value: ${missingValue.title}`, req.method, BAD_REQUEST);
    return res.status(BAD_REQUEST).send(` ${missingValue.title} missing from request`);
  }

    OfficeAccessCard.deleteOne({ cardBytes })
        .then(result => {
            if (result.n < 1) {
                res.sendStatus(NOT_FOUND);
                writeLog(`card ${cardBytes} not found`, req.method, NOT_FOUND, req.originalUrl);
            } else {
                res.sendStatus(OK);
                writeLog(`card ${cardBytes} deleted`, req.method, OK, req.originalUrl);
            }
        })
        .catch(() => {
            res.sendStatus(BAD_REQUEST);
        });


});

module.exports = router;