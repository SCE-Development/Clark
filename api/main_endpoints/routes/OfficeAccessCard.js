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

function checkIfCardExists(cardBytes) {
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.findOne({ cardBytes }, (error, result) => {
        if (error) {
          logger.error('checkIfCardExists got an error querying mongodb: ', error);
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

router.get('/verify', async (req, res) => {
  const { cardBytes, add = false } = req.query;
  const apiKey = req.headers['x-api-key'];

  const required = [
    { value: apiKey, title: 'X-API-Key HTTP header', },
    { value: cardBytes, title: 'cardBytes query parameter', },
  ];

  const missingValue = required.find(({ value }) => !value);

  if (missingValue) {
    res.status(BAD_REQUEST).send(`${missingValue.title} missing from request`);
    return;
  }

  if (apiKey !== API_KEY) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardExists = await checkIfCardExists(cardBytes);

  if (cardExists) {
    return res.sendStatus(OK);
  }

  // if a card doesnt exist and we arent trying
  // to add a new one, that means we were trying
  // to verify a card, and that card isnt found.
  // therefore return a non OK status
  if (!add) {
    return res.sendStatus(NOT_FOUND);
  }

  try {
    if (add) {
      logger.info('adding a new card');
      await new OfficeAccessCard({
        cardBytes
      }).save();
      return res.sendStatus(OK);
    }
  } catch (error) {
    logger.error('Error creating OfficeAccessCard: ', error);
    return res.sendStatus(SERVER_ERROR);
  }
});

module.exports = router;
