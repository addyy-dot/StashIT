/**
 * @file messageRoutes.js
 * @description Why this file exists: To map HTTP requests under /api/messages to message controller handlers.
 * @description Responsibility: Binds private routes to message controller actions and applies the 'protect' authentication middleware.
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getConversationMessages,
} = require('../controllers/messageController');

// All message routes are private and require authorization
router.route('/')
  .post(protect, sendMessage);

router.route('/:conversationId')
  .get(protect, getConversationMessages);

module.exports = router;
