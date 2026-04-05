/**
 * @file Conversation.js
 * @description Why this file exists: To define the Mongoose schema for conversations.
 * @description Responsibility: Stores conversation participants (buyer and seller) and references the listing item being discussed.
 */

const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages 'createdAt' and 'updatedAt' fields
  }
);

// Indexes for high performance queries
// participants index speeds up inbox searches for a specific user
ConversationSchema.index({ participants: 1 });
// item index helps find discussions around a specific product/listing
ConversationSchema.index({ item: 1 });

module.exports = mongoose.model('Conversation', ConversationSchema);
