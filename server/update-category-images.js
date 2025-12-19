import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';
import MenuItem from './src/models/MenuItem.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Category to Image URL mapping
const CATEGORY_IMAGES = {
  // BEHROUZ
  'desserts-behrouz': 'https://foodish-api.com/images/dessert/dessert1.jpg',
  'kebabs-behrouz': 'https://foodish-api.com/images/biryani/biryani1.jpg',
  'royal-biryanis': 'https://foodish-api.com/images/biryani/biryani2.jpg',
  'curries-behrouz': 'https://foodish-api.com/images/biryani/biryani18.jpg',
  
  // BIRYANI-BLUES
  'classic-biryanis': 'https://foodish-api.com/images/biryani/biryani3.jpg',
  'desserts-biryani-blues': 'https://foodish-api.com/images/dessert/dessert2.jpg',
  'kebabs-biryani-blues': 'https://foodish-api.com/images/biryani/biryani4.jpg',
  'signature-biryanis': 'https://foodish-api.com/images/biryani/biryani5.jpg',
  
  // BOX8
  'biryanis': 'https://foodish-api.com/images/biryani/biryani6.jpg',
  'desi-meals': 'https://foodish-api.com/images/biryani/biryani19.jpg',
  'desserts-box8': 'https://foodish-api.com/images/dessert/dessert3.jpg',
  'rice-bowls-box8': 'https://foodish-api.com/images/rice/rice1.jpg',
  'wraps': 'https://foodish-api.com/images/burger/burger1.jpg',
  
  // FAASOS
  'beverages-faasos': 'https://foodish-api.com/images/burger/burger2.jpg',
  'rolls': 'https://foodish-api.com/images/burger/burger3.jpg',
  'rice-bowls-faasos': 'https://foodish-api.com/images/rice/rice2.jpg',
  'wraps-faasos': 'https://foodish-api.com/images/burger/burger4.jpg',
  
  // FIRANGI-BAKE
  'baked-pasta': 'https://foodish-api.com/images/pasta/pasta1.jpg',
  'garlic-bread': 'https://foodish-api.com/images/pizza/pizza1.jpg',
  'lasagnas': 'https://foodish-api.com/images/pasta/pasta2.jpg',
  'mac-cheese': 'https://foodish-api.com/images/pasta/pasta3.jpg',
  
  // FRESH-MENU
  'asian-fusion': 'https://foodish-api.com/images/burger/burger12.jpg',
  'continental': 'https://foodish-api.com/images/pasta/pasta4.jpg',
  'gourmet-meals': 'https://foodish-api.com/images/pizza/pizza2.jpg',
  'healthy': 'https://foodish-api.com/images/dessert/dessert10.jpg',
  
  // KETTLE-CURRY
  'appetizers': 'https://foodish-api.com/images/biryani/biryani10.jpg',
  'breads': 'https://foodish-api.com/images/pizza/pizza3.jpg',
  'curries': 'https://foodish-api.com/images/biryani/biryani11.jpg',
  'rice': 'https://foodish-api.com/images/rice/rice3.jpg',
  
  // LUNCHBOX
  'desserts-lunchbox': 'https://foodish-api.com/images/dessert/dessert4.jpg',
  'homestyle-meals': 'https://foodish-api.com/images/biryani/biryani20.jpg',
  'parathas': 'https://foodish-api.com/images/burger/burger5.jpg',
  'thalis': 'https://foodish-api.com/images/rice/rice4.jpg',
  
  // MANDARIN-OAK
  'dim-sum': 'https://foodish-api.com/images/biryani/biryani12.jpg',
  'fried-rice': 'https://foodish-api.com/images/rice/rice5.jpg',
  'main-course': 'https://foodish-api.com/images/burger/burger8.jpg',
  'noodles': 'https://foodish-api.com/images/burger/burger9.jpg',
  
  // OVENSTORY
  'beverages-ovenstory': 'https://foodish-api.com/images/burger/burger6.jpg',
  'classic-pizzas': 'https://foodish-api.com/images/pizza/pizza4.jpg',
  'garlic-bread-ovenstory': 'https://foodish-api.com/images/pizza/pizza5.jpg',
  'signature-pizzas': 'https://foodish-api.com/images/pizza/pizza6.jpg',
  
  // SWEET-TRUTH
  'cakes': 'https://foodish-api.com/images/dessert/dessert5.jpg',
  'desserts': 'https://foodish-api.com/images/dessert/dessert6.jpg',
  'ice-creams': 'https://foodish-api.com/images/dessert/dessert7.jpg',
  'pastries': 'https://foodish-api.com/images/dessert/dessert8.jpg',
  
  // THE-GOOD-BOWL
  'grain-bowls': 'https://foodish-api.com/images/rice/rice6.jpg',
  'protein-bowls': 'https://foodish-api.com/images/burger/burger7.jpg',
  'salad-bowls': 'https://foodish-api.com/images/dessert/dessert11.jpg',
  'smoothies': 'https://foodish-api.com/images/dessert/dessert9.jpg',
  
  // WOW-CHINA (duplicate keys, will be handled by lookup logic)
  'starters': 'https://foodish-api.com/images/biryani/biryani13.jpg',
  
  // WOW-MOMO
  'fried-momos': 'https://foodish-api.com/images/biryani/biryani14.jpg',
  'momo-combos': 'https://foodish-api.com/images/biryani/biryani15.jpg',
  'steamed-momos': 'https://foodish-api.com/images/biryani/biryani16.jpg',
  'tandoori-momos': 'https://foodish-api.com/images/biryani/biryani17.jpg',
  
  // Additional mappings for categories that appear in multiple brands
  'fried-rice-mandarin-oak': 'https://foodish-api.com/images/rice/rice5.jpg',
  'fried-rice-wow-china': 'https://foodish-api.com/images/rice/rice7.jpg',
  'main-course-mandarin-oak': 'https://foodish-api.com/images/burger/burger8.jpg',
  'main-course-wow-china': 'https://foodish-api.com/images/burger/burger10.jpg',
  'noodles-mandarin-oak': 'https://foodish-api.com/images/burger/burger9.jpg',
  'noodles-wow-china': 'https://foodish-api.com/images/burger/burger11.jpg',
  'desserts-sweet-truth': 'https://foodish-api.com/images/dessert/dessert6.jpg',
  'curries-kettle-curry': 'https://foodish-api.com/images/biryani/biryani11.jpg',
  'garlic-bread-firangi-bake': 'https://foodish-api.com/images/pizza/pizza1.jpg',
};

const uploadToCloudinary = async (imageUrl, categoryName) => {
  try {
    console.log(`   📸 Uploading to Cloudinary...`);
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'eatclub/menu-items',
      transformation: [
        { width: 500, height: 500, crop: 'fill' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    console.log(`   ✅ Uploaded successfully`);
    return result.secure_url;
  } catch (error) {
    console.error(`   ❌ Upload failed:`, error.message);
    return imageUrl; // Fallback to original URL
  }
};

const updateCategoryImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    console.log('======================================================================');
    console.log('📸 UPLOADING CATEGORY IMAGES TO CLOUDINARY');
    console.log('======================================================================\n');

    const categories = await Category.find().sort({ productId: 1 });
    const categoryImageMap = new Map(); // Map categorySourceId to Cloudinary URL
    
    let uploadCount = 0;
    let currentProduct = '';

    for (const category of categories) {
      if (category.productId !== currentProduct) {
        currentProduct = category.productId;
        console.log(`\n🍽️  ${category.productId.toUpperCase()}`);
        console.log('----------------------------------------------------------------------');
      }

      // Find matching image URL
      let imageKey = category.sourceId;
      let imageUrl = CATEGORY_IMAGES[imageKey];
      
      // Handle duplicate category names across brands
      if (!imageUrl) {
        imageKey = `${category.sourceId}-${category.productId}`;
        imageUrl = CATEGORY_IMAGES[imageKey];
      }

      if (!imageUrl) {
        console.log(`⚠️  ${category.name}: No image mapping found (${imageKey})`);
        continue;
      }

      console.log(`\n📂 ${category.name}`);
      console.log(`   🔗 Source: ${imageUrl}`);
      
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(imageUrl, category.name);
      
      // Update category image
      await Category.updateOne(
        { _id: category._id },
        { imageUrl: cloudinaryUrl }
      );
      
      // Store mapping for MenuItem updates
      categoryImageMap.set(category.sourceId, cloudinaryUrl);
      
      console.log(`   💾 Category updated`);
      uploadCount++;
    }

    console.log('\n======================================================================');
    console.log('📝 UPDATING MENU ITEMS WITH CATEGORY IMAGES');
    console.log('======================================================================\n');

    let itemUpdateCount = 0;
    currentProduct = '';

    for (const category of categories) {
      if (category.productId !== currentProduct) {
        currentProduct = category.productId;
        console.log(`\n🍽️  ${category.productId.toUpperCase()}`);
        console.log('----------------------------------------------------------------------');
      }

      const cloudinaryUrl = categoryImageMap.get(category.sourceId);
      if (!cloudinaryUrl) continue;

      // Update all menu items in this category
      const result = await MenuItem.updateMany(
        { categorySourceId: category.sourceId },
        { imageUrl: cloudinaryUrl }
      );

      console.log(`📂 ${category.name}: Updated ${result.modifiedCount} items`);
      itemUpdateCount += result.modifiedCount;
    }

    console.log('\n======================================================================');
    console.log('✅ UPDATE COMPLETE');
    console.log('======================================================================');
    console.log(`📸 Categories updated: ${uploadCount}`);
    console.log(`📝 Menu items updated: ${itemUpdateCount}`);
    console.log('======================================================================\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateCategoryImages();
