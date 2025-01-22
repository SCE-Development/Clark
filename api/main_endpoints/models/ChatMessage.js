const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatMessageSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxLength: [255, 'Messages are at most 255 characters long']
    },
    chatRoomId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expireAt: {
      type: Date,
      default: Date.now() + 10 * 60 * 1000 // expires in 10 minutes
    }
  },
  { collection: 'ChatMessage' }
);
ChatMessageSchema.index({ createdAt: 1, chatRoomId: 1 });  // schema level compound index

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
