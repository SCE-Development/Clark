const MembershipPayment = require('../models/MembershipPayment');
const logger = require('../../util/logger');
const axios = require('axios');
const { doorCodeDistribution = {} } = require('../../config/config.json');
const { DCD_URL } = doorCodeDistribution;

const status = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

function findVerifyPayment(confirmationCode, userId) {
  return new Promise((resolve) => {
    try {
      MembershipPayment.findOneAndUpdate(
        {
          confirmationCode,
          status: status.PENDING,
        },
        {
          $set: { userId, status: status.COMPLETED },
        },
        {
          useFindAndModify: false,
          new: true,
        },
        (error, result) => {
          if (error) {
            logger.error('findVerifyPayment got an error querying mongodb: ', error);
            return resolve(null);
          }
          if (!result) {
            logger.info('findVerifyPayment found no matching payment for confirmation code: ', confirmationCode);
            return resolve(null);
          }
          return resolve(result);
        }
      );
    } catch (error) {
      logger.error('findVerifyPayment caught an error: ', error);
      return resolve(null);
    }
  });
}

function storePayment({ confirmationCode, amount, payerName, note, transactionId }) {
  return new Promise((resolve) => {
    try {
      const newPayment = new MembershipPayment({
        confirmationCode,
        amount,
        venmoDetails: {
          transactionId,
          payerName,
          note,
        },
      });

      newPayment.save((error) => {
        if (error) {
          logger.error('storePayment got an error saving to mongodb: ', error);
          return resolve(false);
        }
        return resolve(true);
      });
    } catch (error) {
      logger.error('storePayment caught an error: ', error);
      return resolve(false);
    }
  });
}

async function requestDoorCode() {
  try {
    const response = await axios.get(DCD_URL + "/getDoorCode");
    if (response.status === 200 && response.data && response.data.code) {
      return response.data.code;
    } else {
      logger.error('requestDoorCode received unexpected response from DCD:', response.status, response.data);
      return null;
    }
  } catch (error) {
    logger.error('requestDoorCode encountered an error:', error);
    return null;
  }
}

module.exports = { findVerifyPayment, storePayment, requestDoorCode };
