const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MembershipPaymentSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: Object.keys({PENDING: 'PENDING', COMPLETED: 'COMPLETED', FAILED: 'FAILED'  }),
      default: 'PENDING',
      required: true,
    },
    confirmationCode: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    venmoDetails:{
      transactionId: { type: String, default: '' },
      payerName: { type: String, default: '' },
      note: { type: String, default: '' },
    }
  },
  { collection: 'MembershipPayments' }
);


module.exports = mongoose.model('MembershipPayment.js', MembershipPaymentSchema);
