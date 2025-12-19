import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './src/models/MenuItem.js';
import Category from './src/models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
};

const generateReport = async () => {
  try {
    await connectDB();

    // Get data from public folder
    const menusDir = path.join(__dirname, '..', 'client', 'public', 'data', 'menus');
    const files = fs.readdirSync(menusDir).filter(f => f.endsWith('.json'));

    let publicCategories = 0;
    let publicItems = 0;
    const publicBreakdown = [];

    for (const file of files) {
      const filePath = path.join(menusDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      publicCategories += data.categories.length;
      publicItems += data.items.length;
      publicBreakdown.push({
        file,
        productId: data.productId,
        categories: data.categories.length,
        items: data.items.length
      });
    }

    // Get data from MongoDB
    const dbCategories = await Category.countDocuments();
    const dbItems = await MenuItem.countDocuments();

    const categoryByProduct = await Category.aggregate([
      { $group: { _id: '$productId', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const itemsByBrand = await MenuItem.aggregate([
      { $group: { _id: '$brandName', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n' + '='.repeat(70));
    console.log('📊 COMPREHENSIVE IMPORT COMPARISON REPORT');
    console.log('='.repeat(70));

    console.log('\n📁 PUBLIC FOLDER DATA (SOURCE)');
    console.log('-'.repeat(70));
    console.log(`Total Categories: ${publicCategories}`);
    console.log(`Total Items: ${publicItems}`);
    console.log('\nBreakdown by menu:');
    publicBreakdown.forEach(b => {
      console.log(`  ${b.productId.padEnd(20)} - ${b.categories} categories, ${b.items} items`);
    });

    console.log('\n🗄️  DATABASE IMPORT (DESTINATION)');
    console.log('-'.repeat(70));
    console.log(`Total Categories: ${dbCategories}`);
    console.log(`Total Items: ${dbItems}`);
    
    console.log('\nCategories by product:');
    categoryByProduct.forEach(c => {
      console.log(`  ${c._id.padEnd(20)} - ${c.count}`);
    });

    console.log('\nItems by brand:');
    itemsByBrand.forEach(b => {
      console.log(`  ${b._id.padEnd(25)} - ${b.count}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('✅ FINAL VERIFICATION');
    console.log('='.repeat(70));

    if (publicCategories === dbCategories && publicItems === dbItems) {
      console.log('✅ PERFECT MATCH! All data successfully imported.');
      console.log(`   ✅ ${dbCategories} categories`);
      console.log(`   ✅ ${dbItems} menu items`);
    } else {
      console.log('⚠️  MISMATCH DETECTED:');
      if (publicCategories !== dbCategories) {
        console.log(`   ❌ Categories: Expected ${publicCategories}, Found ${dbCategories}`);
      } else {
        console.log(`   ✅ Categories: ${dbCategories} (Perfect)`);
      }
      if (publicItems !== dbItems) {
        console.log(`   ❌ Items: Expected ${publicItems}, Found ${dbItems}`);
      } else {
        console.log(`   ✅ Items: ${dbItems} (Perfect)`);
      }
    }

    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

generateReport();
