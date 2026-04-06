const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

dotenv.config();

const checkDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stashit');
    console.log('Connected to DB');

    const conversations = await Conversation.find({}).populate('participants', 'name email').populate('item', 'title');
    console.log(`Found ${conversations.length} conversations in total:`);
    for (const c of conversations) {
      console.log(`\nConversation ID: ${c._id}`);
      console.log(`Item: "${c.item?.title}"`);
      console.log(`Participants: ${c.participants.map(p => `${p?.name} (${p?.email})`).join(', ')}`);
      
      const messages = await Message.find({ conversation: c._id }).populate('sender', 'name');
      console.log(`  Messages (${messages.length}):`);
      messages.forEach((m) => {
        console.log(`    [Sender: ${m.sender?.name}] "${m.text}" (${m.createdAt.toLocaleTimeString()})`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkDb();
