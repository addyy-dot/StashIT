/**
 * @file Listing.js
 * @description Why this file exists: To define the structure, rules, and relationships for Item Listings stored in the MongoDB database.
 * @description Responsibility: Defines fields representing a product listing (title, description, price, category, condition, image URL, Cloudinary asset ID, status, and owner reference) and enforces validation constraints.
 */

const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the listing'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for the listing'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please specify the listing price'],
      min: [0, 'Price cannot be a negative value'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Books',
          'Furniture',
          'Electronics',
          'Sports',
          'Hostel Essentials',
          'GiveAway Corner',
          'Others',
        ],
        message: 'Please select a valid category from: Books, Furniture, Electronics, Sports, Hostel Essentials, GiveAway Corner, or Others',
      },
    },
    condition: {
      type: String,
      required: [true, 'Please specify the item condition'],
      enum: {
        values: ['New', 'Like New', 'Good', 'Fair'],
        message: 'Please select a valid condition from: New, Like New, Good, or Fair',
      },
    },
    image: {
      type: String,
      required: [true, 'Please provide an item image'],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Please provide the image public ID'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Sold'],
      default: 'Available',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;

/**
 * Line-by-line Explanation:
 * Line 7: Imports Mongoose package.
 * Line 9: Initiates the Listing Schema mapping definition.
 * Line 11-16: Declares 'title' as a required, trimmed string capped at 100 characters.
 * Line 17-20: Declares 'description' as a required, trimmed text field.
 * Line 21-24: Declares 'price' requiring non-negative numbers.
 * Line 25-39: Configures 'category' string enum restricting options to target campus categories.
 * Line 40-47: Configures 'condition' string enum limiting selections to New, Like New, Good, and Fair.
 * Line 48-51: Declares 'image' storing the Cloudinary hosting URL.
 * Line 52-55: Declares 'cloudinaryPublicId' representing the key used to purge files from Cloudinary storage.
 * Line 56-61: Configures 'status' defaulting to 'Available'.
 * Line 62-66: Maps relational 'seller' ObjectId ref referencing the 'User' collection model.
 * Line 69: Automatically tracks 'createdAt' and 'updatedAt' transaction records.
 * Line 73: Creates Mongoose model class named 'Listing'.
 * Line 75: Exports 'Listing' class.
 */
