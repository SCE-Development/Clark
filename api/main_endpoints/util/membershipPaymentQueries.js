const MembershipPayment = require('../models/MembershipPayment');
const logger = require('../../util/logger');

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
        createdAt: new Date(),
        confirmationCode,
        amount,
        venmoPaymentDetails: {
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

module.exports = { findVerifyPayment, storePayment };
