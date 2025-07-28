const OfficeAccessCard = require('../models/OfficeAccessCard.js');
const logger = require('../../util/logger');
const { ADJECTIVES, NOUNS } = require('../../util/CardReaderConstants.js');

function checkIfCardExists({ cardBytes = null, alias = null } = {}) {
  const body = (cardBytes !== null) ? { cardBytes } : { alias };
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.findOneAndUpdate(
        body,
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
            const { description } = body;
            logger.info(`Card:${description} not found in the database`);
          }
          return resolve(result); // return the document
        });
    } catch (error) {
      logger.error('checkIfCardExists caught an error: ', error);
      return resolve(false);
    }
  });
}

async function createCardAlias() {
  let aliasExists = true;
  const currentAliases = await getAllCardAliases();
  const MAX_ATTEMPTS = 10;
  let attempts = 0
  let alias = 'DEFAULT_ALIAS';
  while (aliasExists && attempts < MAX_ATTEMPTS) {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    alias = adjective + ' ' + noun;
    aliasExists = currentAliases.includes(alias);
    attempts++;

  }
  return alias;
}

async function getAllCardAliases() {
    try {
        const result = await OfficeAccessCard.find({}, 'alias');
        const aliases = result.map(card => card.alias);
        return aliases;
    } catch (error) {
        logger.info('Error with getting card aliases: ', error)
        return [];
    }
}

function deleteCard(cardBytes) {
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.findOneAndDelete({ cardBytes }, (error, result) => {
          if (error) {
            logger.error('deleteCard got an error querying mongodb: ', error);
            return resolve(false);
          }
          if (!result) {
            logger.info(`Card ${ cardBytes } not found in the database`);
          }
          return resolve(result);
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
            OfficeAccessCard.find({  }, (error, result) => {
                if (error) {
                    logger.error('getAllCards got an error querying mongodb: ', error);
                    return resolve(false);
                }
                return resolve(result);
            });
        } catch (error) {
            logger.error('getAllCards caught an error: ', error);
            return resolve(false);
        }
    });
}

module.exports = { checkIfCardExists, createCardAlias, deleteCard, getAllCards };
