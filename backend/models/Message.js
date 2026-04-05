/**
 * @file Message.js
 * @description Why this file exists: To define the Mongoose schema for messages.
 * @description Responsibility: Holds individual text messages within a conversation, mapping the sender and timestamp.
 */

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages 'createdAt' and 'updatedAt' fields
  }
);

// Indexes for high performance queries
// Speeds up fetching messages within a conversation ordered chronologically
MessageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
