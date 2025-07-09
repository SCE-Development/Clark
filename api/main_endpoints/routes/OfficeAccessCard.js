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

router.use(bodyParser.json());

const clients = [];

const writeMessage = ((endpoint, response_code, response_string, cardBytes, add) => {
  const messageObj = {
    ISO_date: new Date().toISOString(),
    endpoint,
    response_code,
    response_string,
    cardBytes,
    add
  };

  clients.forEach(res => res.write(`data: ${JSON.stringify(messageObj)}\n\n`));

});


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

router.get('/getCardData', (req, res) => {
  OfficeAccessCard.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.get('/verify', async (req, res) =>{
  const { cardBytes, add = false } = req.query;
  const apiKey = req.headers['x-api-key'];

  let endpoint = req.path;
  if (add){
    endpoint += `?add=${add}`;

  }

  const required = [
    { value: apiKey, title: 'X-API-Key HTTP header', },
    { value: cardBytes, title: 'cardBytes query parameter', },
  ];

  const missingValue = required.find(({ value }) => !value);
  

  
  if (missingValue) {
    writeMessage(endpoint, BAD_REQUEST, ` ${missingValue.title} missing from request`, cardBytes, add);
    return res.status(BAD_REQUEST).send(` ${missingValue.title} missing from request`);
  }

  if (apiKey !== API_KEY) {
    writeMessage(endpoint, UNAUTHORIZED, '', cardBytes, add);
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardExists = await checkIfCardExists(cardBytes);
  if (cardExists) {
    writeMessage(endpoint, OK, '', cardBytes, add);
    return res.status(OK);
  }
  // if a card doesnt exist and we arent trying
  // to add a new one, that means we were trying
  // to verify a card, and that card isnt found.
  // therefore return a non OK status
  if (!add) {
    writeMessage(endpoint, NOT_FOUND, '', cardBytes, add);
    return res.sendStatus(NOT_FOUND);
  }

  try {
    if (add) {
      logger.info('adding a new card');
      await new OfficeAccessCard({
        cardBytes
      }).save();
      writeMessage(endpoint, OK, '', cardBytes, add);
      return res.sendStatus(OK)
    }
  } catch (error) {
    writeMessage(endpoint, SERVER_ERROR, '', cardBytes, add);
    logger.error('Error creating OfficeAccessCard: ', error);
    return res.sendStatus(SERVER_ERROR);
  }



});


router.get('/listen', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    clients.push(res);
    // OfficeAccessCard.find()
    // .then(response => response.json())
    // .then(data => res.write(`data: ${JSON.stringify(data)}\n\n`))

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
})

module.exports = router;
