import MembershipPayment from '../main_endpoints/models/MembershipPayment.js';
const status = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

function findVerifyPayment(confirmationCode, userId) {
  return new Promise((resolve) => {
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
  });
}

function rejectPayment(paymentId) {
  return new Promise((resolve) => {
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
  });
}

module.exports = { findVerifyPayment, rejectPayment };
