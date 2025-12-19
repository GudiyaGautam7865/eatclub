import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';

// ES module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('Mongo connection string missing. Set MONGODB_URI (preferred) or MONGO_URI in your .env');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Upload image URL to Cloudinary
const uploadImageToCloudinary = async (imageUrl, itemName) => {
  try {
    if (!imageUrl) {
      console.log(`⚠️  No image URL for ${itemName}`);
      return null;
    }

    console.log(`📤 Uploading image for: ${itemName}`);
    
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'eatclub/menu-items',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    console.log(`✅ Image uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload image for ${itemName}:`, error.message);
    // Return original URL as fallback
    return imageUrl;
  }
};

// Load brands data
const loadBrands = () => {
  const brandsPath = path.join(__dirname, '../../../client/public/data/brands.json');
  const brandsData = JSON.parse(fs.readFileSync(brandsPath, 'utf-8'));
  return brandsData.brands;
};

// Load menu files
const loadMenuFiles = () => {
  const menusDir = path.join(__dirname, '../../../client/public/data/menus');
  const files = fs.readdirSync(menusDir).filter(file => file.endsWith('.json'));
  
  return files.map(file => {
    const filePath = path.join(menusDir, file);
    const menuData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return menuData;
  });
};

// Migrate menu data
const migrateMenuData = async () => {
  try {
    console.log('🚀 Starting menu data migration...\n');

    // Connect to database
    await connectDB();

    // Load brands
    const brands = loadBrands();
    console.log(`📦 Loaded ${brands.length} brands\n`);

    // Load all menu files
    const menus = loadMenuFiles();
    console.log(`📋 Loaded ${menus.length} menu files\n`);

    let totalItems = 0;
    let successCount = 0;
    let errorCount = 0;

    // Process each menu
    for (const menu of menus) {
      const productId = menu.productId;
      
      // Find matching brand
      const brand = brands.find(b => b.name.toLowerCase().includes(productId.toLowerCase()));
      
      if (!brand) {
        console.log(`⚠️  Brand not found for productId: ${productId}`);
        continue;
      }

      console.log(`\n🍽️  Processing ${brand.name} (${menu.items.length} items)...`);

      // Process each menu item
      for (const item of menu.items) {
        totalItems++;

        try {
          // Find category name
          const category = menu.categories.find(c => c.id === item.categoryId);
          
          if (!category) {
            console.log(`⚠️  Category not found for item: ${item.name}`);
            continue;
          }

          const sourceId = item.id ? item.id.toString() : undefined;

          // Upload image to Cloudinary
          const cloudinaryUrl = await uploadImageToCloudinary(item.imageUrl, item.name);

          // Check if item already exists for this sourceId (allows duplicate names)
          if (sourceId) {
            const existingItem = await MenuItem.findOne({
              brandId: brand.id.toString(),
              sourceId,
            });

            if (existingItem) {
              console.log(`⏭️  Skipping duplicate sourceId: ${item.name} (${sourceId})`);
              continue;
            }
          }

          // Create menu item in database
          await MenuItem.create({
            sourceId,
            brandId: brand.id.toString(),
            brandName: brand.name,
            categoryId: item.categoryId,
            categoryName: category.name,
            name: item.name,
            description: item.description || '',
            price: item.price,
            membershipPrice: item.membershipPrice,
            isVeg: item.isVeg !== undefined ? item.isVeg : true,
            imageUrl: cloudinaryUrl,
            isAvailable: true,
          });

          successCount++;
          console.log(`✅ Created: ${item.name}`);

          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
          errorCount++;
          console.error(`❌ Error processing ${item.name}:`, error.message);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log(`   Total items processed: ${totalItems}`);
    console.log(`   ✅ Successfully created: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run migration
migrateMenuData();
