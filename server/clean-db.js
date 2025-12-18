import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import MenuItem from './src/models/MenuItem.js';
import Category from './src/models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
};

const cleanDatabase = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    const categoriesCount = await Category.countDocuments();
    const itemsCount = await MenuItem.countDocuments();

    console.log('Current data:');
    console.log(`  Categories: ${categoriesCount}`);
    console.log(`  Menu Items: ${itemsCount}\n`);

    console.log('🗑️  Deleting all categories and menu items...');
    
    await MenuItem.deleteMany({});
    await Category.deleteMany({});

    console.log('✅ Database cleaned successfully!\n');
    console.log('You can now run: npm run migrate:menu:v2');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

cleanDatabase();
