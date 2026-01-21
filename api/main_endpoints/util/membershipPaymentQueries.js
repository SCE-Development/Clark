const MembershipPayment = require('../models/MembershipPayment');

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
            return resolve(null);
          }
          if (!result) {
            return resolve(false);
          }
          return resolve(result);
        }
      );
    } catch (error) {
      return resolve(null);
    }
  });
}

function rejectPayment(paymentId) {
  return new Promise((resolve) => {
    try {
      MembershipPayment.findByIdAndUpdate(
        paymentId,
        { $set: { status: status.REJECTED } },
        (error, result) => {
          if (error) {
            return resolve(null);
          }
          if (!result) {
            return resolve(false);
          }
          return resolve(true);
        }
      );
    } catch (error) {
      return resolve(null);
    }
  });
}

function storePayment({ userId, confirmationCode, amount, payerName, note, transactionId }) {
  return new Promise((resolve) => {
    try {
      const newPayment = new MembershipPayment({
        createdAt: new Date(),
        userId,
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

module.exports = { findVerifyPayment, rejectPayment, storePayment };
