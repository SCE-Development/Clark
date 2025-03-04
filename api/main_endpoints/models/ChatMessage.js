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
      maxLength: [2000, 'Messages are at most 255 characters long']
    },
    chatRoomId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expireAt: {
      type: Date,
      default: function() {
        // Calculate expiration using createdAt + 24 hours
        return new Date(this.createdAt.getTime() + 24 * 60 * 60 * 1000);
      }
    }
  },
  { collection: 'ChatMessage' }
);
ChatMessageSchema.index({ createdAt: 1, chatRoomId: 1 });  // schema level compound index

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
