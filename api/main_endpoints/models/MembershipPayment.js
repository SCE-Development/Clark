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
      enum: ['pending', 'completed', 'rejected'],
      default: 'pending',
      required: true,
    },
    confirmationCode: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    venmoDetails:{
      transactionId: { type: String },
      payerName: { type: String },
      note: { type: String },
    }
  },
  { collection: 'MembershipPayments' }
);


module.exports = mongoose.model('MembershipPayment.js', MembershipPaymentSchema);
