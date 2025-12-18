import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MenuItem from './src/models/MenuItem.js';
import Category from './src/models/Category.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  const items = await MenuItem.aggregate([{ $group: { _id: '$brandName', count: { $sum: 1 } } }]);
  const cats = await Category.aggregate([{ $group: { _id: '$productId', count: { $sum: 1 } } }]);
  console.log(JSON.stringify({ items, cats }, null, 2));
  await mongoose.connection.close();
};

run().catch(err => { console.error(err); process.exit(1); });
