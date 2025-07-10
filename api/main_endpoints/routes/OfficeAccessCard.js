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

const writeMessage = ((endpoint, response_code, response_string, cardBytes, add, alias) => {
  const messageObj = {
    ISO_date: new Date().toISOString(),
    endpoint,
    response_code,
    response_string,
    cardBytes,
    add,
    alias
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
          $set: { lastVerified: Date.now() },
          
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

async function getAliasByCardBytes(cardBytes) {
  try {
    const card = await OfficeAccessCard.findOne({ cardBytes }, 'alias'); // only fetch alias
    return card?.alias || null;
  } catch (error) {
    logger.error('getAliasByCardBytes error:', error);
    return null;
  }
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
  let alias = await getAliasByCardBytes(cardBytes);
  
  if(!alias){
    const path = require('path');
    const fs = require('fs').promises; 

    const nounsPath = path.join(__dirname, '../../util/nouns.txt');
    const adjectivesPath = path.join(__dirname, '../../util/adjectives.txt');

    const nounsText = await fs.readFile(nounsPath, 'utf8');
    const adjectivesText = await fs.readFile(adjectivesPath, 'utf8');

    const nouns = nounsText.split(/\s+/).filter(Boolean);
    const adjectives = adjectivesText.split(/\r?\n/).filter(Boolean);

    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    alias = `${randomAdjective} ${randomNoun}`;

  }
  


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
    writeMessage(endpoint, BAD_REQUEST, ` ${missingValue.title} missing from request`, cardBytes, add, "n/a");
    return res.status(BAD_REQUEST).send(` ${missingValue.title} missing from request`);
  }

  if (apiKey !== API_KEY) {
    writeMessage(endpoint, UNAUTHORIZED, 'Invalid API Key', cardBytes, add, "n/a");
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardExists = await checkIfCardExists(cardBytes);
  

  if (cardExists) {
    OfficeAccessCard.findOne({cardBytes:cardBytes})
    .then(items => (alias = items))

    writeMessage(endpoint, OK, 'Card found!', cardBytes, add, alias);
    return res.status(OK);
  }
  // if a card doesnt exist and we arent trying
  // to add a new one, that means we were trying
  // to verify a card, and that card isnt found.
  // therefore return a non OK status
  if (!add) {
    writeMessage(endpoint, NOT_FOUND, 'Card not found', cardBytes, add, "n/a");
    return res.sendStatus(NOT_FOUND);
  }

  try {
    if (add) {
      logger.info('adding a new card');
      await new OfficeAccessCard({
        cardBytes,
        alias
      }).save();
      writeMessage(endpoint, OK, 'Card added', cardBytes, add, alias);
      return res.sendStatus(OK)
    }
  } catch (error) {
    writeMessage(endpoint, SERVER_ERROR, 'Error creating new card', cardBytes, add, "n/a");
    logger.error('Error creating OfficeAccessCard: ', error);
    return res.sendStatus(SERVER_ERROR);
  }



});


router.post('/delete', async (req, res) => {
    OfficeAccessCard.deleteOne({ _id: req.body._id })
    .then(result => {
      if (result.n < 1) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(OK);
      }
    })
    .catch(() => {
      res.sendStatus(BAD_REQUEST);
    });
})


router.get('/listen', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    clients.push(res);

    req.on('close', () => {
        res.end();
    });
})

module.exports = router;
