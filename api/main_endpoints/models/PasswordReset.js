const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordResetSchema = new Schema(
  {
    resetToken: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 86400000), // 24 hours
      index: { expireAfterSeconds: 0 },
    }
  },
  { collection: 'PasswordResets' }
);

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
