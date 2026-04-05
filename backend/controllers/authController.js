/**
 * @file authController.js
 * @description Why this file exists: To house the core controller functions that manage user onboarding (registration) and authentication (login).
 * @description Responsibility: Handles incoming API requests for registration and login, validates fields, checks database duplicates, hashes user secrets (delegated to User model), signs JSON Web Tokens (JWT), and formats response JSON payloads.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Utility function to generate a JSON Web Token
 * @param {string} id - The MongoDB user ID
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * @desc    Register a new student user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  const { name, regNo, year, email, password } = req.body;

  try {
    // 1. Check for missing fields
    if (!name || !regNo || !year || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all registration fields');
    }

    // 2. Check if user already exists by email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('A student user with this email already exists');
    }

    // 3. Check if user already exists by registration number
    const regNoExists = await User.findOne({ regNo });
    if (regNoExists) {
      res.status(400);
      throw new Error('A student user with this registration number already exists');
    }

    // 4. Create new user record
    const user = await User.create({
      name,
      regNo,
      year,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          regNo: user.regNo,
          year: user.year,
          email: user.email,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user details provided');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Check for missing credentials
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // 2. Locate user by email
    const user = await User.findOne({ email });

    // 3. Validate credentials and compare password
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          regNo: user.regNo,
          year: user.year,
          email: user.email,
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};

/**
 * Line-by-line Explanation:
 * Line 8: Imports jsonwebtoken utility.
 * Line 9: Imports User model containing schemas and methods.
 * Line 16: Defines 'generateToken' signature capturing MongoDB ObjectID value.
 * Line 17-19: Signs JWT payload containing user ID with backend secret process.env.JWT_SECRET and expiration configuration.
 * Line 26: Declares asynchronous function 'registerUser' taking Express parameters.
 * Line 27: Extracts field parameters from req.body.
 * Line 31-34: Validates inputs. If missing, sets status to 400 and throws an error that will be caught in the try-catch block and passed to next().
 * Line 37-41: Queries User model for conflicting email string.
 * Line 44-48: Queries User model for conflicting registration number.
 * Line 51-57: Passes parameters to Mongoose create constructor. The user password is automatically hashed before saving by the schema pre-save middleware.
 * Line 59-71: If registration succeeds, returns code 201 (Created) along with the signed JWT and safe user properties.
 * Line 72-74: Throws generic error fallback if database transaction fails without throw.
 * Line 75-77: Catch block passes runtime errors directly to Express errorHandler using 'next(error)'.
 * Line 84: Declares asynchronous function 'loginUser'.
 * Line 85: De-structures email and password inputs.
 * Line 89-92: Checks that email and password exist, else throws status 400.
 * Line 95: Searches database for existing User record matching input email.
 * Line 98-109: Compares password inputs using model method user.matchPassword(). On success, responds with status 200 and a JWT. Otherwise, sets code 401 (Unauthorized) and throws error.
 * Line 110-112: Catch block forwards error objects.
 * Line 115-118: Exports registration and login controller methods.
 */
