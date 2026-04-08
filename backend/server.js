/**
 * @file server.js
 * @description Why this file exists: This is the main entry point of the backend application. It initializes the Express server, applies security configurations, connects to the database, imports routes, and mounts error handlers.
 * @description Responsibility: Bootstraps the application, mounts all system router endpoints, configures JSON body parsers, enables cross-origin resource sharing (CORS), and sets up the server port listener.
 */

const dotenv = require('dotenv');
// Load environment variables from .env file immediately before requiring internal files
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Establish connection to MongoDB database
connectDB();

// Initialize the Express application instance
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Express built-in body parser middleware to handle incoming JSON requests
app.use(express.json());

// Express built-in URL-encoded parser middleware to handle form-data submissions
app.use(express.urlencoded({ extended: true }));

// Mount authentication API endpoints
app.use('/api/auth', authRoutes);

// Mount listings API endpoints
app.use('/api/listings', listingRoutes);

// Mount chat conversations and messages endpoints
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

/**
 * Health Check Endpoint
 * @route GET /api/health
 * @desc Checks if the server is responsive and healthy
 * @access Public
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StashIT backend API is operational',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Use error-handling middleware for unrecognized endpoints
app.use(notFound);

// Use global error handler for catching internal service errors
app.use(errorHandler);

// Define server listener port
const PORT = process.env.PORT || 5000;

// Start the Express server listener
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Trigger nodemon restart
module.exports = server;

/**
 * Line-by-line Explanation:
 * Line 8: Imports the 'express' web framework module.
 * Line 9: Imports 'cors' middleware to permit frontend web origins to interact with this API.
 * Line 10: Imports 'dotenv' package to manage application environment settings.
 * Line 11: Imports the 'connectDB' helper function created in db.js.
 * Line 12: Imports the 'notFound' and 'errorHandler' global middleware structures.
 * Line 15: Configures dotenv to parse the '.env' file, injecting variables into 'process.env'.
 * Line 18: Invokes 'connectDB()' to connect to the MongoDB Atlas or local MongoDB service.
 * Line 21: Instantiates the Express application object.
 * Line 24: Applies 'cors()' to allow cross-origin HTTP requests.
 * Line 27: Mounts express.json() parser. This allows the server to parse incoming JSON payloads (req.body).
 * Line 30: Mounts express.urlencoded() parser. This allows the server to parse incoming URL-encoded form data payloads.
 * Line 38: Defines a GET request handler for '/api/health'.
 * Line 39: Responds with status 200 (OK) and a JSON confirmation indicating server availability, current server system time, and service process uptime.
 * Line 48: Registers the custom 'notFound' middleware. If a request hits this point without matching a route, a 404 error is generated.
 * Line 51: Registers the custom 'errorHandler' middleware to intercept errors, format JSON responses, and prevent stack leakage.
 * Line 54: Declares a fallback port using logic: if 'PORT' exists in process.env, use it; otherwise, default to port 5000.
 * Line 57: Initiates the listener on the declared PORT and logs a startup statement.
 * Line 60: Exports the server instance. This is useful for unit testing frameworks or scaling utilities.
 */
