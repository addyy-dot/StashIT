/**
 * @file seed.js
 * @description Why this file exists: To populate the database with test listing items for verified marketplace functionality testing.
 * @description Responsibility: Clears the 'listings' collection and populates it with a set of test books, furniture, and sports items linked to the default test user.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('./models/Listing');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding...');

    // Find the default test user we registered
    const user = await User.findOne({ email: 'adharsh@aitpune.edu.in' });
    if (!user) {
      console.log('Please register adharsh@aitpune.edu.in first');
      process.exit(1);
    }

    // Delete existing listings to start fresh
    await Listing.deleteMany({});
    console.log('Cleared existing listings.');

    // Seed dummy listings
    const listings = [
      {
        title: 'Maths Book 1st Year',
        description: 'Applied Mathematics textbook by NP Bali. Brand new condition.',
        price: 350,
        category: 'Books',
        condition: 'New',
        image: 'https://res.cloudinary.com/dummy/maths.jpg',
        cloudinaryPublicId: 'dummy_maths_id',
        status: 'Available',
        seller: user._id,
      },
      {
        title: 'Hostel Study Table',
        description: 'Wooden study table, sturdy and compact, perfect for hostel rooms.',
        price: 1200,
        category: 'Furniture',
        condition: 'Good',
        image: 'https://res.cloudinary.com/dummy/table.jpg',
        cloudinaryPublicId: 'dummy_table_id',
        status: 'Available',
        seller: user._id,
      },
      {
        title: 'Sports Badminton Racket',
        description: 'Yonex Muscle Power 29 Badminton racket. Needs regutting.',
        price: 800,
        category: 'Sports',
        condition: 'Fair',
        image: 'https://res.cloudinary.com/dummy/racket.jpg',
        cloudinaryPublicId: 'dummy_racket_id',
        status: 'Available',
        seller: user._id,
      },
    ];

    await Listing.insertMany(listings);
    console.log('Seeded 3 listings successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
