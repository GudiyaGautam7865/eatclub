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

const generatePlaceholderImage = async (itemName, categoryName) => {
  try {
    // Use Unsplash Source API for food images
    const searchTerm = categoryName.toLowerCase().includes('dessert') ? 'dessert' :
                      categoryName.toLowerCase().includes('beverage') ? 'drink' :
                      categoryName.toLowerCase().includes('biryani') ? 'biryani' :
                      categoryName.toLowerCase().includes('paratha') ? 'paratha' :
                      categoryName.toLowerCase().includes('sandwich') ? 'sandwich' : 'food';
    
    const randomId = Math.floor(Math.random() * 1000);
    const imageUrl = `https://source.unsplash.com/500x500/?${searchTerm},indian-food&sig=${randomId}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'eatclub/menu-items',
      transformation: [
        { width: 500, height: 500, crop: 'fill' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Placeholder upload failed for ${itemName}:`, error.message);
    return 'https://via.placeholder.com/500x500?text=Food+Item';
  }
};

const generateRandomItemData = (categoryName, index) => {
  const basePrice = Math.floor(Math.random() * (300 - 80 + 1)) + 80;
  const membershipPrice = Math.floor(basePrice * 0.85);
  
  const itemNames = {
    'mini': [`Mini ${categoryName} ${index + 1}`, `Classic ${categoryName} Box ${index + 1}`, `Special ${categoryName} ${index + 1}`],
    'desi-box': [`Desi ${categoryName} ${index + 1}`, `Traditional ${categoryName} ${index + 1}`, `Home Style ${categoryName} ${index + 1}`],
    'biryani-thali': [`Biryani Thali Special ${index + 1}`, `Dum Biryani Combo ${index + 1}`, `Royal Biryani Thali ${index + 1}`],
    'main-course': [`Main Course Special ${index + 1}`, `Chef's Choice ${index + 1}`, `Signature Dish ${index + 1}`],
    'paratha-rolls': [`Paratha Roll ${index + 1}`, `Stuffed Roll ${index + 1}`, `Special Paratha Wrap ${index + 1}`],
    'desi-sandwiches': [`Desi Sandwich ${index + 1}`, `Indian Sandwich ${index + 1}`, `Grilled Special ${index + 1}`],
    'beverages': [`Refreshing Drink ${index + 1}`, `Cool Beverage ${index + 1}`, `Special Shake ${index + 1}`],
    'desserts': [`Sweet Delight ${index + 1}`, `Dessert Special ${index + 1}`, `Indian Sweet ${index + 1}`]
  };
  
  const descriptions = [
    'Delicious and freshly prepared',
    'Made with authentic spices and ingredients',
    'A perfect blend of taste and quality',
    'Chef\'s special recipe',
    'Popular choice among customers'
  ];
  
  const categoryKey = Object.keys(itemNames).find(key => categoryName.toLowerCase().includes(key)) || 'main-course';
  const nameOptions = itemNames[categoryKey];
  const name = nameOptions[index % nameOptions.length];
  
  return {
    name,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    price: basePrice,
    membershipPrice,
    isVeg: Math.random() > 0.3 // 70% veg items
  };
};

const getBrandInfo = (productId) => {
  return PRODUCT_BRAND_MAP[productId] || { id: `AUTO-${productId}`, name: productId.toUpperCase() };
};

const verifyAndMigrateCategoryByCategory = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected\n');

    const menusDir = path.join(__dirname, '..', 'client', 'public', 'data', 'menus');
    const files = fs.readdirSync(menusDir).filter(f => f.endsWith('.json'));

    console.log('='.repeat(70));
    console.log('📊 CATEGORY-BY-CATEGORY VERIFICATION & MIGRATION');
    console.log('='.repeat(70) + '\n');

    let totalAdded = 0;
    let totalVerified = 0;

    for (const file of files) {
      const filePath = path.join(menusDir, file);
      const menuData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const brand = getBrandInfo(menuData.productId);

      console.log(`\n${'='.repeat(70)}`);
      console.log(`🍽️  ${brand.name} (${menuData.productId})`);
      console.log('='.repeat(70));

      for (const cat of menuData.categories) {
        console.log(`\n${'─'.repeat(70)}`);
        console.log(`📂 CATEGORY: ${cat.name} (ID: ${cat.id})`);
        console.log(`${'─'.repeat(70)}`);

        // Step 1: Verify/Create Category
        console.log(`\n🔍 Step 1: Verifying category in database...`);
        let dbCategory = await Category.findOne({
          productId: menuData.productId,
          sourceId: cat.id
        });

        if (!dbCategory) {
          console.log(`   ⚠️  Category not found - creating...`);
          dbCategory = await Category.create({
            sourceId: cat.id,
            productId: menuData.productId,
            name: cat.name,
            imageUrl: null,
          });
          console.log(`   ✅ Category created successfully`);
        } else {
          console.log(`   ✅ Category exists in database`);
        }

        // Step 2: Compare items
        console.log(`\n🔍 Step 2: Comparing items...`);
        const jsonItems = menuData.items.filter(item => item.categoryId === cat.id);
        const dbItems = await MenuItem.find({
          brandId: brand.id.toString(),
          categorySourceId: cat.id
        });

        console.log(`   📊 JSON file: ${jsonItems.length} items`);
        console.log(`   📊 Database: ${dbItems.length} items`);

        if (jsonItems.length === dbItems.length) {
          console.log(`\n   ✅ PERFECT MATCH - All ${jsonItems.length} items present in database`);
          totalVerified += jsonItems.length;
        } else {
          const missing = jsonItems.length - dbItems.length;
          console.log(`\n   ⚠️  MISMATCH DETECTED - ${missing} item(s) missing from database`);
          
          // Step 3: Add missing items
          console.log(`\n🔍 Step 3: Adding missing items...`);
          const itemSourceIdCount = {};
          let categoryAdded = 0;

          // If JSON has items, use them; otherwise generate random items
          if (jsonItems.length > 0) {
            for (const jsonItem of jsonItems) {
              // Generate unique sourceId
              let sourceId = jsonItem.id ? jsonItem.id.toString() : null;
              
              if (sourceId) {
                if (!itemSourceIdCount[sourceId]) {
                  itemSourceIdCount[sourceId] = 0;
                } else {
                  itemSourceIdCount[sourceId]++;
                  sourceId = `${sourceId}-${itemSourceIdCount[sourceId]}`;
                }
              }

              // Check if this specific item exists
              const exists = await MenuItem.findOne({
                brandId: brand.id.toString(),
                sourceId,
              });

              if (!exists) {
                console.log(`   ➕ Adding: "${jsonItem.name}"`);
                
                const cloudinaryUrl = await uploadImageToCloudinary(jsonItem.imageUrl, jsonItem.name);
                
                await MenuItem.create({
                  sourceId,
                  brandId: brand.id.toString(),
                  brandName: brand.name,
                  categoryId: dbCategory._id.toString(),
                  categorySourceId: cat.id,
                  categoryName: dbCategory.name,
                  name: jsonItem.name,
                  description: jsonItem.description || '',
                  price: jsonItem.price,
                  membershipPrice: jsonItem.membershipPrice,
                  isVeg: jsonItem.isVeg !== undefined ? jsonItem.isVeg : true,
                  imageUrl: cloudinaryUrl,
                  isAvailable: true,
                });

                console.log(`      ✅ Added successfully (sourceId: ${sourceId})`);
                totalAdded++;
                categoryAdded++;

                await new Promise(resolve => setTimeout(resolve, 500));
              } else {
                totalVerified++;
              }
            }
          } else {
            // Generate random items if JSON is empty but DB expects items
            console.log(`   🎲 Generating random items for category "${cat.name}"...`);
            
            for (let i = 0; i < missing; i++) {
              const randomData = generateRandomItemData(cat.name, i);
              const sourceId = `${cat.id}-generated-${Date.now()}-${i}`;
              
              console.log(`   ➕ Generating: "${randomData.name}"`);
              console.log(`      📸 Uploading placeholder image to Cloudinary...`);
              
              const cloudinaryUrl = await generatePlaceholderImage(randomData.name, cat.name);
              
              await MenuItem.create({
                sourceId,
                brandId: brand.id.toString(),
                brandName: brand.name,
                categoryId: dbCategory._id.toString(),
                categorySourceId: cat.id,
                categoryName: dbCategory.name,
                name: randomData.name,
                description: randomData.description,
                price: randomData.price,
                membershipPrice: randomData.membershipPrice,
                isVeg: randomData.isVeg,
                imageUrl: cloudinaryUrl,
                isAvailable: true,
              });

              console.log(`      ✅ Generated and added successfully`);
              console.log(`      💰 Price: ₹${randomData.price} | Member: ₹${randomData.membershipPrice}`);
              console.log(`      🌿 ${randomData.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}`);
              totalAdded++;
              categoryAdded++;

              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }

          if (categoryAdded > 0) {
            console.log(`\n   ✅ Added ${categoryAdded} item(s) to category "${cat.name}"`);
          }
        }

        // Verify final count for this category
        const finalDbItems = await MenuItem.countDocuments({
          brandId: brand.id.toString(),
          categorySourceId: cat.id
        });
        console.log(`\n   📊 Final verification: ${finalDbItems} items in database`);
        
        if (finalDbItems === jsonItems.length) {
          console.log(`   ✅ Category "${cat.name}" is now complete!\n`);
        } else {
          console.log(`   ⚠️  Warning: Count still doesn't match!\n`);
        }
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 FINAL SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Items verified: ${totalVerified}`);
    console.log(`➕ Items added: ${totalAdded}`);
    console.log('='.repeat(70) + '\n');

    // Final count
    const finalCategories = await Category.countDocuments();
    const finalItems = await MenuItem.countDocuments();
    
    console.log(`\n📊 Database totals:`);
    console.log(`   Categories: ${finalCategories}`);
    console.log(`   Menu Items: ${finalItems}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

verifyAndMigrateCategoryByCategory();
