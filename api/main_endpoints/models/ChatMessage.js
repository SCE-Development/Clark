const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
  chatroomId: {
    type: String,
    required: true,
    index: true,
    ref: 'Chatroom',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
  }
});

// Compound index
ChatMessageSchema.index({ chatroomId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
