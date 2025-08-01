const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatMessageSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date,
      default: ()=> Date.now() + 24 * 3600 * 1000, // expires in 24 hours
    },
    chatroomId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    }
  }
);

ChatMessageSchema.index({chatroomId: 1, createdAt: -1}); // sort by whatever is created most currently
ChatMessageSchema.index({expiresAt: 1}, {expireAfterSeconds: 0}); // TTL index for automatic expiration

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
