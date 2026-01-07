import MembershipPayment from '../main_endpoints/models/MembershipPayment.js';

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
          new: true,
          runValidators: true,
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

module.exports = { findVerifyPayment, rejectPayment };
