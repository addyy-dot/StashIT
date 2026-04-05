/**
 * @file db.js
 * @description Why this file exists: This file contains the configuration and logic required to establish a connection to the MongoDB database using Mongoose.
 * @description Responsibility: Its sole responsibility is to initiate a connection to the MongoDB database using the connection URI provided in the environment variables, handling success and failure states gracefully.
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas or local MongoDB instance.
 * Uses the MONGO_URI from the environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Exit process with failure (1) to shut down the server if connection fails
    process.exit(1);
  }
};

module.exports = connectDB;

/**
 * Line-by-line Explanation:
 * Line 7: Imports the Mongoose library which provides MongoDB object modeling.
 * Line 13: Defines an asynchronous function 'connectDB' using async/await syntax to handle the asynchronous network call.
 * Line 14: Starts a try-catch block to handle any errors that occur during connection setup.
 * Line 15: Calls mongoose.connect with the database URI fetched from process.env.MONGO_URI.
 * Line 17: Logs a success message containing the host name of the connected database instance.
 * Line 18: Catches any error thrown during mongoose.connect execution.
 * Line 19: Logs the error message for debugging purposes.
 * Line 21: Calls process.exit(1) to terminate the Node.js process. This is crucial in production because a web server cannot serve requests properly without a working database connection.
 * Line 25: Exports the connectDB function so it can be initialized in the root server entry file.
 */
