const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordReset = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
      index: {  expires: '1h' }
    }
  }
);

module.exports = mongoose.model('PasswordReset', PasswordReset);