import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';

dotenv.config();

const listCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const categories = await Category.find().sort({ productId: 1, name: 1 });
    
    console.log('📂 ALL CATEGORIES (' + categories.length + ' total)\n');
    console.log('=' .repeat(70));
    
    let currentProduct = '';
    categories.forEach((cat, index) => {
      if (cat.productId !== currentProduct) {
        currentProduct = cat.productId;
        console.log(`\n🍽️  ${cat.productId.toUpperCase()}`);
        console.log('-'.repeat(70));
      }
      console.log(`${(index + 1).toString().padStart(2, '0')}. ${cat.name} (sourceId: ${cat.sourceId})`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log(`\n📊 Total: ${categories.length} categories across 14 brands\n`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

listCategories();
