/**
 * @file authRoutes.js
 * @description Why this file exists: To map HTTP endpoints under /api/auth to their corresponding business logic controllers.
 * @description Responsibility: Handles route matching for registration and login POST requests, routing incoming client traffic to registerUser and loginUser.
 */

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

/**
 * Route: POST /api/auth/register
 * Desc:  Registers a student user
 * Access: Public
 */
router.post('/register', registerUser);

/**
 * Route: POST /api/auth/login
 * Desc:  Authenticates student user and returns token
 * Access: Public
 */
router.post('/login', loginUser);

module.exports = router;

/**
 * Line-by-line Explanation:
 * Line 7: Imports Express framework.
 * Line 8: Instantiates Express Router subclass to configure decoupled subroutes.
 * Line 9: Imports 'registerUser' and 'loginUser' controllers from authController.js.
 * Line 15: Maps POST requests to '/register' to execute registerUser logic.
 * Line 21: Maps POST requests to '/login' to execute loginUser logic.
 * Line 23: Exports the router object for mounting inside server.js.
 */
