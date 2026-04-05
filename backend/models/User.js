/**
 * @file User.js
 * @description Why this file exists: To define the structure, constraints, and methods for the User database collection using Mongoose.
 * @description Responsibility: Encapsulates user details (name, regNo, year, email, password), runs server-side email validation targeting AIT Pune domains, automatically hashes passwords using bcrypt before persistence, and provides credential verification utility methods.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    regNo: {
      type: String,
      required: [true, 'Please provide your registration number'],
      unique: true,
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please specify your class year'],
      min: [1, 'Year must be at least 1 (First Year)'],
      max: [4, 'Year must be at most 4 (Final Year)'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your campus email address'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          // Regular expression checking if email ends strictly with @aitpune.edu.in
          return /^[a-zA-Z0-9._%+-]+@aitpune\.edu\.in$/.test(value);
        },
        message: 'Access restricted: Please register with your official @aitpune.edu.in college email.',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware: hashes the user password before saving it to the database
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified or is newly created
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Custom schema method to check if entered password matches the hashed password in database.
 * @param {string} enteredPassword - The plain text password entered by user.
 * @returns {Promise<boolean>} True if match, false otherwise.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

/**
 * Line-by-line Explanation:
 * Line 7: Imports Mongoose module for database object modeling.
 * Line 8: Imports bcryptjs library to securely hash user passwords.
 * Line 10: Instantiates new Mongoose Schema for User data mapping.
 * Line 12-16: Declares 'name' field as a required string with white space trimming.
 * Line 17-22: Declares 'regNo' as a required, unique string.
 * Line 23-28: Declares 'year' field as a required number restricted between 1 and 4 representing student year levels.
 * Line 29-41: Declares 'email' field. Added unique and lowercase constraints. Placed validation logic ensuring email string strictly concludes with '@aitpune.edu.in'.
 * Line 42-46: Declares 'password' field requiring minimum length of 6 characters to ensure password security.
 * Line 49: Automatically injects 'createdAt' and 'updatedAt' timestamps into the schema.
 * Line 54: Declares pre-save middleware run before MongoDB write operations.
 * Line 56: Skips hashing operation if the password was not modified (e.g. updating profile details other than password).
 * Line 61: Generates salt factor of 10.
 * Line 62: Hashes password value using generated salt and assigns the hash value to schema variable.
 * Line 63: Calls next() to advance execution to the database driver.
 * Line 73-75: Adds helper method 'matchPassword' using bcrypt.compare to securely evaluate entered plain passwords against stored hashes.
 * Line 77: Registers schema model as Mongoose object collection named 'User'.
 * Line 79: Exports 'User' model.
 */
