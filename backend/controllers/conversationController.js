/**
 * @file conversationController.js
 * @description Why this file exists: To handle API requests for managing buyer-seller conversations.
 * @description Responsibility: Handles conversation creation, checks for self-messaging and duplicates, and retrieves all conversations for the authenticated user.
 */

const Conversation = require('../models/Conversation');
const Listing = require('../models/Listing');

/**
 * @desc    Create a new conversation or return existing one
 * @route   POST /api/conversations
 * @access  Private
 */
const createConversation = async (req, res, next) => {
  const { sellerId, listingId } = req.body;
  const buyerId = req.user._id;

  try {
    // 1. Validation
    if (!sellerId || !listingId) {
      res.status(400);
      throw new Error('Seller ID and Listing ID are required');
    }

    // 2. Prevent user from starting a conversation with themselves
    if (buyerId.toString() === sellerId.toString()) {
      res.status(400);
      throw new Error('You cannot start a conversation with yourself');
    }

    // 3. Verify the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404);
      throw new Error('Listing not found');
    }

    // 4. Check if conversation already exists for this listing and participants
    let conversation = await Conversation.findOne({
      item: listingId,
      participants: { $all: [buyerId, sellerId] },
    });

    if (conversation) {
      // Return existing conversation
      return res.status(200).json({
        success: true,
        conversation,
      });
    }

    // 5. Create new conversation
    conversation = await Conversation.create({
      participants: [buyerId, sellerId],
      item: listingId,
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all conversations for the active logged-in user
 * @route   GET /api/conversations
 * @access  Private
 */
const getUserConversations = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('participants', 'name email year regNo') // Include seller/buyer details
      .populate('item', 'title price image status') // Include listing details
      .sort({ updatedAt: -1 }); // Sort by latest activity first

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConversation,
  getUserConversations,
};
