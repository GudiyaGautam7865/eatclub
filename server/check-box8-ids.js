import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './src/models/MenuItem.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI).then(async () => {
  const items = await MenuItem.find({ brandId: '3' }).select('name sourceId categorySourceId');
  console.log('BOX8 Items in DB:', items.length);
  items.forEach(i => console.log(`  ${i.sourceId} - ${i.name} (cat: ${i.categorySourceId})`));
  process.exit(0);
});
