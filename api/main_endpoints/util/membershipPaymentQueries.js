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
          amount: { $gte: 20 },
        },
        {
          $set: { userId, status: status.COMPLETED },
        },
        {
          new: true,
          runValidators: true,
        }
      ).then(payment => resolve(payment))
       .catch(() => resolve(null));
    } catch (err) {
      resolve(null);
    }
  });
}

function rejectPayment(paymentId) {
  return new Promise((resolve) => {
    try {
      MembershipPayment.updateOne(
        { _id: paymentId },
        { $set: { status: status.REJECTED } }
      ).then(result => resolve(result))
       .catch(() => resolve(null));
    } catch (err) {
      resolve(null);
    }
  });
}

module.exports = { findVerifyPayment, rejectPayment };
