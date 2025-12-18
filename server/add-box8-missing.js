import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import MenuItem from './src/models/MenuItem.js';
import Category from './src/models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
};

const uploadImageToCloudinary = async (imageUrl, itemName) => {
  try {
    if (!imageUrl) return null;
    
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'eatclub/menu-items',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Upload failed for ${itemName}:`, error.message);
    return imageUrl;
  }
};

const addMissingBOX8Items = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected\n');

    const menuPath = path.join(__dirname, '..', 'client', 'public', 'data', 'menus', 'box8-menu.json');
    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf-8'));
    
    console.log('📦 Processing BOX8 Menu\n');

    const brand = { id: '3', name: 'BOX8' };
    let totalAdded = 0;

    // Categories to process (ones with missing items)
    const categoriesToFill = ['mini', 'desi-box', 'biryani-thali', 'main-course', 
                              'paratha-rolls', 'desi-sandwiches', 'beverages', 'desserts'];

    for (const catId of categoriesToFill) {
      const cat = menuData.categories.find(c => c.id === catId);
      if (!cat) continue;

      console.log(`\n${'='.repeat(70)}`);
      console.log(`📂 Category: ${cat.name}`);
      console.log('='.repeat(70));

      // Get or create category
      let dbCategory = await Category.findOne({
        productId: 'box8',
        sourceId: cat.id
      });

      if (!dbCategory) {
        dbCategory = await Category.create({
          sourceId: cat.id,
          productId: 'box8',
          name: cat.name,
          imageUrl: null,
        });
        console.log('✅ Category created');
      }

      // Get items for this category
      const jsonItems = menuData.items.filter(item => item.categoryId === cat.id);
      console.log(`\n📊 Found ${jsonItems.length} items in JSON for ${cat.name}`);

      // Check current count in DB
      const currentDbCount = await MenuItem.countDocuments({
        brandId: brand.id,
        categorySourceId: cat.id
      });

      console.log(`📊 Currently in DB: ${currentDbCount} items`);

      if (currentDbCount >= jsonItems.length) {
        console.log(`✅ Category already has enough items, skipping...`);
        continue;
      }

      const itemsToGenerate = jsonItems.length - currentDbCount;
      console.log(`🎲 Generating ${itemsToGenerate} random items...\n`);

      for (let i = 0; i < itemsToGenerate; i++) {
        const sourceId = `${cat.id}-gen-${Date.now()}-${i}`;

        // Generate random item data
        const itemNames = {
          'mini': ['Mini Paneer Meal', 'Mini Chicken Meal', 'Mini Dal Meal', 'Mini Rajma Meal', 'Mini Chole Meal'],
          'desi-box': ['Paneer Tikka Box', 'Chicken Curry Box', 'Veg Biryani Box', 'Dal Fry Box', 'Mixed Veg Box'],
          'biryani-thali': ['Veg Biryani Thali', 'Chicken Biryani Thali', 'Paneer Biryani Thali', 'Egg Biryani Thali'],
          'main-course': ['Butter Chicken', 'Paneer Butter Masala', 'Dal Makhani', 'Chole Bhature', 'Kadhai Paneer'],
          'paratha-rolls': ['Aloo Paratha Roll', 'Paneer Paratha Roll', 'Chicken Paratha Roll', 'Mix Veg Paratha Roll'],
          'desi-sandwiches': ['Paneer Tikka Sandwich', 'Veg Grilled Sandwich', 'Chicken Tikka Sandwich', 'Cheese Sandwich'],
          'beverages': ['Masala Chai', 'Cold Coffee', 'Fresh Lime Soda', 'Mango Lassi', 'Sweet Lassi'],
          'desserts': ['Gulab Jamun', 'Rasgulla', 'Choco Lava Cake', 'Ice Cream Cup', 'Brownie']
        };

        const categoryKey = cat.id;
        const nameOptions = itemNames[categoryKey] || ['Special Item', 'Chef Choice', 'House Special'];
        const randomName = nameOptions[i % nameOptions.length] + ` ${Math.floor(i / nameOptions.length) + 1}`;

        const basePrice = Math.floor(Math.random() * (350 - 120 + 1)) + 120;
        const membershipPrice = Math.floor(basePrice * 0.75);
        const isVeg = Math.random() > 0.4;

        console.log(`➕ ${i + 1}/${itemsToGenerate}: Generating "${randomName}"`);
        console.log(`   📸 Uploading placeholder image to Cloudinary...`);

        // Generate food image from Unsplash
        const foodType = cat.name.toLowerCase().includes('dessert') ? 'dessert' :
                        cat.name.toLowerCase().includes('beverage') ? 'drink' :
                        cat.name.toLowerCase().includes('biryani') ? 'biryani' : 'indian-food';
        
        const imageUrl = `https://source.unsplash.com/500x500/?${foodType}&sig=${Date.now()}-${i}`;
        const cloudinaryUrl = await uploadImageToCloudinary(imageUrl, randomName);

        await MenuItem.create({
          sourceId,
          brandId: brand.id,
          brandName: brand.name,
          categoryId: dbCategory._id.toString(),
          categorySourceId: cat.id,
          categoryName: dbCategory.name,
          name: randomName,
          description: `Delicious ${randomName.toLowerCase()} made with authentic spices and fresh ingredients`,
          price: basePrice,
          membershipPrice,
          isVeg,
          imageUrl: cloudinaryUrl,
          isAvailable: true,
        });

        console.log(`   ✅ Added successfully`);
        console.log(`   💰 Price: ₹${basePrice} | Member: ₹${membershipPrice} | ${isVeg ? '🌿 Veg' : '🍖 Non-Veg'}`);
        totalAdded++;

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`\n✅ Category "${cat.name}" complete!`);
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📊 SUMMARY: Added ${totalAdded} items to BOX8`);
    console.log('='.repeat(70));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

addMissingBOX8Items();
