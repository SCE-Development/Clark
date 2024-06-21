const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordResetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '24h'
    }
  },
  { collection: 'PasswordResets' }
);

module.exports = mongoose.models.PasswordReset || mongoose.model('PasswordReset', PasswordResetSchema);
