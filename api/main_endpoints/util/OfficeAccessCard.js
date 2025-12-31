const OfficeAccessCard = require('../models/OfficeAccessCard.js');
const logger = require('../../util/logger');
const { ADJECTIVES, NOUNS } = require('../../util/CardReaderConstants.js');

function verifyCard({ cardBytes = null} = {}) {
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.findOneAndUpdate(
        {
          $inc: { verifiedCount: 1 },
          $set: { lastVerified: Date.now() }
        }, {
          useFindAndModify: false, new: true, upsert: false
        }
        , (error, result) => {
          if (error) {
            logger.error('verifyCard got an error querying mongodb: ', error);
            return resolve(false);
          }
          if (!result) {
            const description = cardBytes !== null ? cardBytes : alias;
            logger.info(`Card: ${description} not found in the database`);
          }
          return resolve(result); // return the document
        });
    } catch (error) {
      logger.error('verifyCard caught an error: ', error);
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
  for (let i = 0; i < 5; ++i) {
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const alias = `${adjective} ${noun}`;
    const aliasExists = await checkIfAliasExists(alias);
    if (aliasExists) continue;
    return alias;
  }
  return new Date().toGMTString();
}

function deleteCard(_id) {
  return new Promise((resolve) => {
    try {
      // OfficeAccessCard.findOneAndDelete(
      //   { _id }
      //   , (error, result) => {
      //     if (error) {
      //       logger.error('deleteCard got an error querying mongodb: ', error);
      //       return resolve(false);
      //     }
      //     if (!result) {
      //       logger.info(`Card ${ alias } not found in the database`);
      //     }
      //     return resolve(!!result);
      //   }
      // );

      OfficeAccessCard.findByIdAndDelete(
        _id,
        (error, result) => {
          if (error) {
            logger.error('deleteCard got an error querying mongodb: ', error);
            return resolve(false);
          }
          if(!result) {
            logger.info(`Card with id: ${ _id } not found in the database`);
            return resolve(null);
          }
          return resolve(result._id);
        }
      );
    } catch (error) {
      logger.error('deleteCard caught an error: ', error);
      return resolve(false);
    }
  });
}

function editAlias(_id, newAlias) {
  return new Promise((resolve) => {
    try {
      OfficeAccessCard.findByIdAndUpdate(
        _id,
        { $set: { alias: newAlias } },
        { new: true, useFindAndModify: false },
        (error, result) => {
          if (error) {
            logger.error('editAlias got an error querying mongodb: ', error);
            return resolve(false);
          }
          if (!result) {
            logger.info(`Card with id ${_id} not found in the database`);
            return resolve(false);
          }
          return resolve(result);
        }
      );
    } catch (error) {
      logger.error('editAlias caught an error: ', error);
      return resolve(false);
    }
  });
}

module.exports = { checkIfCardExists, generateAlias, deleteCard, editAlias };
