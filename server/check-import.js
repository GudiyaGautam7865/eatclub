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

const checkImportedData = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    const categoriesCount = await Category.countDocuments();
    const itemsCount = await MenuItem.countDocuments();

    console.log('='.repeat(60));
    console.log('DATABASE IMPORT STATUS');
    console.log('='.repeat(60));
    console.log(`\nTotal in MongoDB:`);
    console.log(`  Categories: ${categoriesCount}`);
    console.log(`  Menu Items: ${itemsCount}`);

    // Count by productId
    const categoryByProduct = await Category.aggregate([
      { $group: { _id: '$productId', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const itemsByBrand = await MenuItem.aggregate([
      { $group: { _id: '$brandName', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log(`\nCategories by product:`);
    categoryByProduct.forEach(c => {
      console.log(`  ${c._id.padEnd(20)} - ${c.count} categories`);
    });

    console.log(`\nMenu items by brand:`);
    itemsByBrand.forEach(b => {
      console.log(`  ${b._id.padEnd(20)} - ${b.count} items`);
    });

    console.log('='.repeat(60));
    console.log('\n📊 Comparison:');
    console.log(`  Expected: 79 categories, 264 items`);
    console.log(`  Found:    ${categoriesCount} categories, ${itemsCount} items`);
    
    if (categoriesCount === 79 && itemsCount === 264) {
      console.log('  ✅ ALL DATA IMPORTED SUCCESSFULLY!\n');
    } else {
      console.log('  ⚠️  MISMATCH - Some data may be missing\n');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

checkImportedData();
