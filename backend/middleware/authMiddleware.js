/**
 * @file authMiddleware.js
 * @description Why this file exists: To provide an authentication gateway that protects specific routes from being accessed by unauthenticated users.
 * @description Responsibility: Inspects incoming HTTP requests for authorization headers containing JSON Web Tokens (JWT), decodes the token value to verify its signature, queries the User model using the token's ID, and appends the user details (excluding password) to the 'req.user' object for downstream controllers.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Route protection middleware to authenticate users via JWT
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check if Authorization header is present and formatted correctly
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token value from "Bearer <token>" string
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify and decode the token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user in database by ID and attach to request context (excluding password hash)
      req.user = await User.findById(decoded.id).select('-password');

      // If user does not exist in DB (e.g. user deleted but token still valid)
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized: User no longer exists');
      }

      // 4. Move to next middleware or controller
      next();
    } catch (error) {
      console.error(`Auth Middleware Error: ${error.message}`);
      res.status(401);
      next(new Error('Not authorized: Token verification failed'));
    }
  }

  // If no token exists in request header
  if (!token) {
    res.status(401);
    next(new Error('Not authorized: No token provided'));
  }
};

module.exports = {
  protect,
};

/**
 * Line-by-line Explanation:
 * Line 8: Imports jsonwebtoken module.
 * Line 9: Imports User database model.
 * Line 14: Defines 'protect' asynchronous middleware.
 * Line 18-21: Validates that HTTP req.headers contains 'authorization' key starting with word 'Bearer'.
 * Line 24: Splices header string by space and captures the second element (the JWT payload).
 * Line 27: Invokes jwt.verify, checking signature using backend environment secret process.env.JWT_SECRET.
 * Line 30: Queries Mongoose database using the decoded ID. Appends Mongoose `.select('-password')` modifier to ensure the user's password hash is not stored inside req.user.
 * Line 33-36: If the user lookup yields null (e.g. deleted user accounts), throws status 401.
 * Line 39: Invokes next() to pass the request context along to the target route controller.
 * Line 40-44: Catches token decoding errors (such as expiration, tampered signatures) and routes control to global errorHandler with HTTP 401.
 * Line 48-51: If token variable remains undefined, throws status 401.
 * Line 54-56: Exports the 'protect' middleware function.
 */
