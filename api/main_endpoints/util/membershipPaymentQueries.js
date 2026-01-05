import MembershipPayment from '../main_endpoints/models/MembershipPayment.js';
const status = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

export async function findPayment(confirmationCode) {
    return MembershipPayment.findOne({
        confirmationCode,
        status: status.PENDING,
    });
}

export async function verifyPayment(paymentId, userId) {
    await MembershipPayment.updateOne(
        { _id: paymentId }, 
        { $set: { 
            userId,
            status: status.COMPLETED
        }}
    )
}

export async function rejectPayment(paymentId) {
    await MembershipPayment.updateOne(
        { _id: paymentId },
        { $set: { status: status.REJECTED } }
    );
}

