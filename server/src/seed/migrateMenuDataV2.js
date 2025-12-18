import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';

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

// Brand/Product mapping (fills gaps in brands.json)
const PRODUCT_BRAND_MAP = {
  'box8': { id: '3', name: 'BOX8' },
  'behrouz': { id: 'B1', name: 'Behrouz Biryani' },
  'faasos': { id: 'F1', name: 'Faasos' },
  'ovenstory': { id: 'O1', name: 'Oven Story Pizza' },
  'mandarin-oak': { id: 'M1', name: 'Mandarin Oak' },
  'lunchbox': { id: 'L1', name: 'LunchBox' },
  'sweet-truth': { id: 'S1', name: 'Sweet Truth' },
  'the-good-bowl': { id: 'G1', name: 'The Good Bowl' },
  'wow-china': { id: 'W1', name: 'Wow! China' },
  'wow-momo': { id: 'W2', name: 'Wow! Momo' },
  'fresh-menu': { id: 'FR1', name: 'FreshMenu' },
  'firangi-bake': { id: 'FI1', name: 'Firangi Bake' },
  'kettle-curry': { id: 'K1', name: 'Kettle & Curry' },
  'biryani-blues': { id: 'BB1', name: 'Biryani Blues' },
};

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('Mongo connection string missing. Set MONGODB_URI in your .env');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Validate Cloudinary config
const validateCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary config missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
  }
};

// Upload image URL to Cloudinary
const uploadImageToCloudinary = async (imageUrl, itemName, folder = 'eatclub/menu-items') => {
  try {
    if (!imageUrl) {
      return null;
    }

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error(`❌ Upload failed for ${itemName}:`, error.message);
    return imageUrl; // Fallback to original
  }
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

// Get brand info for productId
const getBrandInfo = (productId) => {
  return PRODUCT_BRAND_MAP[productId] || { id: `AUTO-${productId}`, name: productId.toUpperCase() };
};

// Migrate categories for a menu
const migrateCategories = async (menu, stats) => {
  const productId = menu.productId;
  
  for (const cat of menu.categories) {
    try {
      // Upsert category
      const existingCategory = await Category.findOne({
        productId,
        sourceId: cat.id,
      });

      if (existingCategory) {
        console.log(`  ⏭️  Category exists: ${cat.name}`);
        stats.categoriesSkipped++;
      } else {
        // No imageUrl in current data structure, but ready for future
        await Category.create({
          sourceId: cat.id,
          productId,
          name: cat.name,
          imageUrl: null,
        });
        console.log(`  ✅ Category created: ${cat.name}`);
        stats.categoriesCreated++;
      }
    } catch (error) {
      console.error(`  ❌ Category error (${cat.name}):`, error.message);
      stats.categoriesErrors++;
    }
  }
};

// Migrate menu items for a menu
const migrateMenuItems = async (menu, brand, stats) => {
  const productId = menu.productId;
  const itemSourceIdCount = {}; // Track duplicate sourceIds to make them unique
  
  for (const item of menu.items) {
    stats.itemsTotal++;

    try {
      // Find category by productId + sourceId
      const category = await Category.findOne({
        productId,
        sourceId: item.categoryId,
      });

      if (!category) {
        console.log(`  ⚠️  Category not found for item: ${item.name} (categoryId: ${item.categoryId})`);
        stats.itemsErrors++;
        continue;
      }

      // Generate unique sourceId (if duplicate, append counter)
      let sourceId = item.id ? item.id.toString() : null;
      
      if (sourceId) {
        // Track occurrences of this sourceId
        if (!itemSourceIdCount[sourceId]) {
          itemSourceIdCount[sourceId] = 0;
        } else {
          itemSourceIdCount[sourceId]++;
          // Make sourceId unique by appending counter
          sourceId = `${sourceId}-${itemSourceIdCount[sourceId]}`;
        }
      }

      // Check if this unique sourceId already exists
      const existingItem = await MenuItem.findOne({
        brandId: brand.id.toString(),
        sourceId,
      });

      if (existingItem) {
        console.log(`  ⏭️  Item exists: ${item.name}`);
        stats.itemsSkipped++;
        continue;
      }

      // Upload image to Cloudinary
      console.log(`  📤 Uploading: ${item.name}`);
      const cloudinaryUrl = await uploadImageToCloudinary(item.imageUrl, item.name);

      // Create menu item
      await MenuItem.create({
        sourceId,
        brandId: brand.id.toString(),
        brandName: brand.name,
        categoryId: category._id.toString(),
        categorySourceId: item.categoryId,
        categoryName: category.name,
        name: item.name,
        description: item.description || '',
        price: item.price,
        membershipPrice: item.membershipPrice,
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        imageUrl: cloudinaryUrl,
        isAvailable: true,
      });

      console.log(`  ✅ Created: ${item.name}`);
      stats.itemsCreated++;

      // Rate limit delay
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.error(`  ❌ Item error (${item.name}):`, error.message);
      stats.itemsErrors++;
    }
  }
};

// Main migration
const migrateMenuData = async () => {
  try {
    console.log('🚀 Starting comprehensive menu migration...\n');

    // Validate environment
    await connectDB();
    validateCloudinary();

    // Load all menu files
    const menus = loadMenuFiles();
    console.log(`📋 Loaded ${menus.length} menu files\n`);

    const globalStats = {
      categoriesCreated: 0,
      categoriesSkipped: 0,
      categoriesErrors: 0,
      itemsTotal: 0,
      itemsCreated: 0,
      itemsSkipped: 0,
      itemsErrors: 0,
    };

    // Process each menu
    for (const menu of menus) {
      const productId = menu.productId;
      const brand = getBrandInfo(productId);

      console.log(`\n${'='.repeat(60)}`);
      console.log(`🍽️  Processing: ${brand.name} (${productId})`);
      console.log(`   Categories: ${menu.categories.length} | Items: ${menu.items.length}`);
      console.log('='.repeat(60));

      // Migrate categories first
      console.log('\n📂 Migrating categories...');
      await migrateCategories(menu, globalStats);

      // Migrate menu items
      console.log('\n📦 Migrating menu items...');
      await migrateMenuItems(menu, brand, globalStats);
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`\n📂 Categories:`);
    console.log(`   ✅ Created: ${globalStats.categoriesCreated}`);
    console.log(`   ⏭️  Skipped: ${globalStats.categoriesSkipped}`);
    console.log(`   ❌ Errors: ${globalStats.categoriesErrors}`);
    console.log(`\n📦 Menu Items:`);
    console.log(`   Total processed: ${globalStats.itemsTotal}`);
    console.log(`   ✅ Created: ${globalStats.itemsCreated}`);
    console.log(`   ⏭️  Skipped: ${globalStats.itemsSkipped}`);
    console.log(`   ❌ Errors: ${globalStats.itemsErrors}`);
    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run migration
migrateMenuData();
