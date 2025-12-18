import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';

dotenv.config();

const getRestaurantImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const productIds = [
      'box8', 'behrouz', 'faasos', 'ovenstory', 'mandarin-oak', 
      'lunchbox', 'sweet-truth', 'the-good-bowl', 'wow-china', 
      'wow-momo', 'fresh-menu', 'firangi-bake', 'kettle-curry', 
      'biryani-blues'
    ];

    console.log('📸 RESTAURANT CARD IMAGES\n');
    console.log('=' .repeat(70));

    for (const productId of productIds) {
      // Get first category for this product
      const category = await Category.findOne({ productId }).sort({ createdAt: 1 });
      
      if (category && category.imageUrl) {
        console.log(`\n{ id: '${productId}', image: '${category.imageUrl}' },`);
      } else {
        console.log(`\n⚠️  ${productId}: No category image found`);
      }
    }

    console.log('\n' + '='.repeat(70));

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

getRestaurantImages();
