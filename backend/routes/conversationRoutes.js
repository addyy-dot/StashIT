/**
 * @file conversationRoutes.js
 * @description Why this file exists: To map HTTP requests under /api/conversations to conversation controller handlers.
 * @description Responsibility: Binds private routes to conversation controller actions and applies the 'protect' authentication middleware.
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createConversation,
  getUserConversations,
} = require('../controllers/conversationController');

// All conversation routes are private and require authorization
router.route('/')
  .post(protect, createConversation)
  .get(protect, getUserConversations);

module.exports = router;
