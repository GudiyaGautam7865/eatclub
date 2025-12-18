import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './src/models/MenuItem.js';

dotenv.config();

const checkImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get first 3 items
    const items = await MenuItem.find().limit(3);
    
    console.log('📸 Sample Image URLs:\n');
    items.forEach(item => {
      console.log(`${item.name}:`);
      console.log(`   ${item.imageUrl}\n`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkImages();
