const mongoose = require('mongoose');
const { Schema } = mongoose;

const PasswordResetSchema = new Schema({
  resetToken: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h',
  }
});

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
