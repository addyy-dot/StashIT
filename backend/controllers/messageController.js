/**
 * @file messageController.js
 * @description Why this file exists: To handle API requests for exchanging text messages.
 * @description Responsibility: Handles inserting messages, verifying participant authorization, updating parent conversations activity timers, and retrieving conversation chat logs.
 */

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

/**
 * @desc    Send a message within an existing conversation
 * @route   POST /api/messages
 * @access  Private
 */
const sendMessage = async (req, res, next) => {
  const { conversationId, text } = req.body;
  const senderId = req.user._id;

  try {
    // 1. Validation check
    if (!conversationId || !text) {
      res.status(400);
      throw new Error('Conversation ID and text content are required');
    }

    // 2. Locate parent conversation container
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    // 3. Ownership/Access verification: check if current user is a participant
    const isParticipant = conversation.participants.some(
      (pid) => pid.toString() === senderId.toString()
    );

    if (!isParticipant) {
      res.status(403);
      throw new Error('Not authorized to participate in this conversation');
    }

    // 4. Create the message record
    let message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      text: text.trim(),
    });

    // 5. Update Conversation's updatedAt timestamp to bubble it to the top of inbox list
    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    // 6. Populate sender info before returning
    message = await message.populate('sender', 'name email');

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all messages for a specific conversation
 * @route   GET /api/messages/:conversationId
 * @access  Private
 */
const getConversationMessages = async (req, res, next) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  try {
    // 1. Locate the parent conversation container
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    // 2. Ownership/Access verification: check if current user is a participant
    const isParticipant = conversation.participants.some(
      (pid) => pid.toString() === userId.toString()
    );

    if (!isParticipant) {
      res.status(403);
      throw new Error('Not authorized to access these messages');
    }

    // 3. Find and return all messages in chronological order (ascending)
    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversationMessages,
};
