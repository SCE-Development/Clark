const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // create index on createdAt
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
  chatroomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true, // create index on chatroomId
    ref: 'Chatroom', // if you have a Chatroom model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
  },
});

// optional: ensure compound indexes (not required in your case but useful reference)
ChatMessageSchema.index({ createdAt: 1, chatroomId: 1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);