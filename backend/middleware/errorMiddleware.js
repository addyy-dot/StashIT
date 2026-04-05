/**
 * @file errorMiddleware.js
 * @description Why this file exists: To centralize error handling and Route Not Found (404) management across the entire Express API application.
 * @description Responsibility: Handles requests that do not match any defined routes by generating a 404 error, and intercepts all synchronous/asynchronous errors thrown during request execution to return a structured JSON response to the client.
 */

/**
 * Middleware to handle routes that are not found (404 Fallback)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global centralized error handling middleware
 * @param {Object} err - Error object caught from previous middlewares
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for backend debugging
  console.error('API Error: ', err);

  // If the status code is 200, force it to 500 (internal server error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose cast error (e.g. invalid ObjectId format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Resource not found: Invalid ID format';
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Handle Mongoose duplicate key errors (e.g., duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(', ')}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};

/**
 * Line-by-line Explanation:
 * Line 13: Defines 'notFound' middleware. It accepts 'req', 'res', and 'next' as parameters.
 * Line 14: Creates a new Error object indicating the requested path was not found.
 * Line 15: Sets the HTTP response status code to 404 (Not Found).
 * Line 16: Passes the created error to 'next()', routing it directly to the global errorHandler middleware.
 * Line 26: Defines the global 'errorHandler'. In Express, a middleware with 4 arguments is treated as an error handler.
 * Line 28: Evaluates 'statusCode'. If the response status was left as 200 (default success) but an error was thrown, it defaults to 500. Otherwise, it retains the developer-set status.
 * Line 29: Stores the err.message into a message variable.
 * Line 32-35: Checks if the error is a Mongoose 'CastError' on an 'ObjectId' field. If so, updates status code to 400 (Bad Request) and overrides the message to a clean client-friendly warning.
 * Line 38-41: Checks for Mongoose validation errors. If validation fails on model fields, compiles all error messages into a single comma-separated string, setting code to 400.
 * Line 44-47: Checks for MongoDB code 11000 (Duplicate Key Error) (e.g., trying to register an email already registered). Sets status code to 400.
 * Line 49: Responds with the status code and outputs a JSON object containing the status flag, message, and error callstack.
 * Line 52: Restricts printing stack traces to non-production environments to avoid leaking server file paths to clients.
 * Line 56: Exports the functions 'notFound' and 'errorHandler' as an object for use in server.js.
 */
