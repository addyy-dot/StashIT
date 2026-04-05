/**
 * @file seed_chat.js
 * @description Seeder script to prepare buyer, seller, and a listing for testing the chat system.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

dotenv.config();

const seedChatData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stashit');
    console.log('Connected to MongoDB for Chat Seeding...');

    // Clear previous test chat data
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing collections.');

    // Create Seller
    const seller = await User.create({
      name: 'Adharsh Seller',
      regNo: '12345',
      year: 3,
      email: 'seller@aitpune.edu.in',
      password: 'password123', // Will be hashed automatically by pre-save
    });
    console.log('Created seller user:', seller.email);

    // Create Buyer
    const buyer = await User.create({
      name: 'Adharsh Buyer',
      regNo: '54321',
      year: 2,
      email: 'buyer@aitpune.edu.in',
      password: 'password123', // Will be hashed automatically by pre-save
    });
    console.log('Created buyer user:', buyer.email);

    // Create Listing for Seller
    const listing = await Listing.create({
      title: 'Premium Desk Lamp',
      description: 'Adjustable LED desk lamp, multiple color modes, perfect for night study.',
      price: 450,
      category: 'Electronics',
      condition: 'Like New',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
      cloudinaryPublicId: 'sample_lamp',
      status: 'Available',
      seller: seller._id,
    });
    console.log('Created listing:', listing.title);

    console.log('Chat Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedChatData();
