import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import MenuItem from './src/models/MenuItem.js';
import Category from './src/models/Category.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
};

const uploadPlaceholderImage = async (itemName, categoryType) => {
  try {
    const foodTypes = {
      'pizza': 'pizza',
      'biryani': 'biryani',
      'pasta': 'pasta',
      'burger': 'burger',
      'wrap': 'wrap',
      'roll': 'roll',
      'dessert': 'dessert',
      'cake': 'cake',
      'ice-cream': 'ice-cream',
      'chinese': 'chinese-food',
      'momo': 'momo',
      'rice': 'rice-bowl',
      'curry': 'curry',
      'kebab': 'kebab',
      'sandwich': 'sandwich',
      'salad': 'salad',
      'beverage': 'drink'
    };

    const searchTerm = foodTypes[categoryType] || 'food';
    const imageUrl = `https://source.unsplash.com/500x500/?${searchTerm},indian-food&sig=${Date.now()}`;

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
    console.error(`❌ Image upload failed for ${itemName}:`, error.message);
    // Fallback placeholder hosted, avoids DNS issues seen with via.placeholder.com
    return `https://placehold.co/500x500?text=${encodeURIComponent(itemName)}`;
  }
};

// Restaurant/Brand definitions with their unique menu structure
const BRANDS = [
  {
    id: '3',
    productId: 'box8',
    name: 'BOX8',
    categories: [
      { id: 'desi-meals', name: 'Desi Meals', type: 'curry' },
      { id: 'rice-bowls', name: 'Rice Bowls', type: 'rice' },
      { id: 'biryanis', name: 'Biryanis', type: 'biryani' },
      { id: 'wraps', name: 'Wraps & Rolls', type: 'wrap' },
      { id: 'desserts', name: 'Desserts', type: 'dessert' }
    ],
    itemTemplates: [
      'Paneer {category}', 'Chicken {category}', 'Veg {category}', 'Egg {category}',
      'Dal Makhani Box', 'Rajma Chawal', 'Chole Bhature Box', 'Butter Chicken Box'
    ]
  },
  {
    id: 'B1',
    productId: 'behrouz',
    name: 'Behrouz Biryani',
    categories: [
      { id: 'royal-biryanis', name: 'Royal Biryanis', type: 'biryani' },
      { id: 'kebabs', name: 'Kebabs', type: 'kebab' },
      { id: 'curries', name: 'Royal Curries', type: 'curry' },
      { id: 'desserts', name: 'Desserts', type: 'dessert' }
    ],
    itemTemplates: [
      'Hyderabadi {category}', 'Awadhi {category}', 'Lucknowi {category}', 'Royal {category}',
      'Dum Biryani', 'Mughlai Biryani', 'Seekh Kebab', 'Tandoori Kebab'
    ]
  },
  {
    id: 'F1',
    productId: 'faasos',
    name: 'Faasos',
    categories: [
      { id: 'wraps', name: 'Signature Wraps', type: 'wrap' },
      { id: 'rolls', name: 'Classic Rolls', type: 'roll' },
      { id: 'rice-bowls', name: 'Rice Bowls', type: 'rice' },
      { id: 'beverages', name: 'Beverages', type: 'beverage' }
    ],
    itemTemplates: [
      'Paneer {category}', 'Chicken {category}', 'Veg {category}', 'Egg {category}',
      'Tikka Wrap', 'Masala Wrap', 'Kebab Roll', 'Schezwan Roll'
    ]
  },
  {
    id: 'O1',
    productId: 'ovenstory',
    name: 'Oven Story Pizza',
    categories: [
      { id: 'signature-pizzas', name: 'Signature Pizzas', type: 'pizza' },
      { id: 'classic-pizzas', name: 'Classic Pizzas', type: 'pizza' },
      { id: 'garlic-bread', name: 'Garlic Bread', type: 'pizza' },
      { id: 'beverages', name: 'Beverages', type: 'beverage' }
    ],
    itemTemplates: [
      'Margherita Pizza', 'Pepperoni Pizza', 'Veggie Supreme', 'BBQ Chicken',
      'Cheese Burst {category}', 'Tandoori {category}', 'Mexican {category}'
    ]
  },
  {
    id: 'M1',
    productId: 'mandarin-oak',
    name: 'Mandarin Oak',
    categories: [
      { id: 'dim-sum', name: 'Dim Sum', type: 'chinese' },
      { id: 'noodles', name: 'Noodles', type: 'chinese' },
      { id: 'fried-rice', name: 'Fried Rice', type: 'rice' },
      { id: 'main-course', name: 'Main Course', type: 'chinese' }
    ],
    itemTemplates: [
      'Hakka {category}', 'Schezwan {category}', 'Singapore {category}', 'Hong Kong {category}',
      'Chicken Dim Sum', 'Veg Dim Sum', 'Spring Rolls', 'Manchurian'
    ]
  },
  {
    id: 'L1',
    productId: 'lunchbox',
    name: 'LunchBox',
    categories: [
      { id: 'homestyle-meals', name: 'Homestyle Meals', type: 'curry' },
      { id: 'thalis', name: 'Thalis', type: 'curry' },
      { id: 'parathas', name: 'Parathas', type: 'wrap' },
      { id: 'desserts', name: 'Desserts', type: 'dessert' }
    ],
    itemTemplates: [
      'Dal Tadka Meal', 'Paneer Curry Meal', 'Rajma Chawal', 'Chole Chawal',
      'Aloo Paratha', 'Gobi Paratha', '{category} Thali', 'Mini Meal'
    ]
  },
  {
    id: 'S1',
    productId: 'sweet-truth',
    name: 'Sweet Truth',
    categories: [
      { id: 'cakes', name: 'Cakes', type: 'cake' },
      { id: 'pastries', name: 'Pastries', type: 'cake' },
      { id: 'desserts', name: 'Desserts', type: 'dessert' },
      { id: 'ice-creams', name: 'Ice Creams', type: 'ice-cream' }
    ],
    itemTemplates: [
      'Chocolate {category}', 'Vanilla {category}', 'Strawberry {category}', 'Red Velvet {category}',
      'Choco Lava Cake', 'Brownie', 'Tiramisu', 'Cheesecake'
    ]
  },
  {
    id: 'G1',
    productId: 'the-good-bowl',
    name: 'The Good Bowl',
    categories: [
      { id: 'protein-bowls', name: 'Protein Bowls', type: 'salad' },
      { id: 'grain-bowls', name: 'Grain Bowls', type: 'rice' },
      { id: 'salad-bowls', name: 'Salad Bowls', type: 'salad' },
      { id: 'smoothies', name: 'Smoothies', type: 'beverage' }
    ],
    itemTemplates: [
      'Grilled Chicken Bowl', 'Quinoa Bowl', 'Mediterranean Bowl', 'Asian Bowl',
      'Green Salad', 'Caesar Salad', 'Protein Smoothie', 'Fruit Bowl'
    ]
  },
  {
    id: 'W1',
    productId: 'wow-china',
    name: 'Wow! China',
    categories: [
      { id: 'fried-rice', name: 'Fried Rice', type: 'rice' },
      { id: 'noodles', name: 'Noodles', type: 'chinese' },
      { id: 'starters', name: 'Starters', type: 'chinese' },
      { id: 'main-course', name: 'Main Course', type: 'chinese' }
    ],
    itemTemplates: [
      'Schezwan {category}', 'Hakka {category}', 'Singapore {category}', 'Triple {category}',
      'Manchurian', 'Spring Rolls', 'Chilli Chicken', 'Sweet & Sour'
    ]
  },
  {
    id: 'W2',
    productId: 'wow-momo',
    name: 'Wow! Momo',
    categories: [
      { id: 'steamed-momos', name: 'Steamed Momos', type: 'momo' },
      { id: 'fried-momos', name: 'Fried Momos', type: 'momo' },
      { id: 'tandoori-momos', name: 'Tandoori Momos', type: 'momo' },
      { id: 'momo-combos', name: 'Momo Combos', type: 'momo' }
    ],
    itemTemplates: [
      'Chicken {category}', 'Veg {category}', 'Paneer {category}', 'Corn & Cheese {category}',
      'Cheese Momos', 'Schezwan Momos', 'Peri Peri Momos', 'Chocolate Momos'
    ]
  },
  {
    id: 'FR1',
    productId: 'fresh-menu',
    name: 'FreshMenu',
    categories: [
      { id: 'gourmet-meals', name: 'Gourmet Meals', type: 'curry' },
      { id: 'continental', name: 'Continental', type: 'pasta' },
      { id: 'asian-fusion', name: 'Asian Fusion', type: 'chinese' },
      { id: 'healthy', name: 'Healthy Options', type: 'salad' }
    ],
    itemTemplates: [
      'Grilled {category}', 'Pan Seared {category}', 'Chef Special {category}', 'Signature {category}',
      'Pasta Alfredo', 'Risotto', 'Steak', 'Sushi Bowl'
    ]
  },
  {
    id: 'FI1',
    productId: 'firangi-bake',
    name: 'Firangi Bake',
    categories: [
      { id: 'lasagnas', name: 'Lasagnas', type: 'pasta' },
      { id: 'baked-pasta', name: 'Baked Pasta', type: 'pasta' },
      { id: 'mac-cheese', name: 'Mac & Cheese', type: 'pasta' },
      { id: 'garlic-bread', name: 'Garlic Breads', type: 'pizza' }
    ],
    itemTemplates: [
      'Classic {category}', 'Cheesy {category}', 'Spicy {category}', 'Italian {category}',
      'Pesto Pasta', 'Arrabiata', 'Carbonara', 'Alfredo'
    ]
  },
  {
    id: 'K1',
    productId: 'kettle-curry',
    name: 'Kettle & Curry',
    categories: [
      { id: 'curries', name: 'Curries', type: 'curry' },
      { id: 'rice', name: 'Rice Varieties', type: 'rice' },
      { id: 'breads', name: 'Breads', type: 'wrap' },
      { id: 'appetizers', name: 'Appetizers', type: 'kebab' }
    ],
    itemTemplates: [
      'Butter Chicken', 'Paneer Tikka Masala', 'Dal Makhani', 'Korma',
      'Jeera Rice', 'Biryani Rice', 'Naan', 'Tandoori Roti'
    ]
  },
  {
    id: 'BB1',
    productId: 'biryani-blues',
    name: 'Biryani Blues',
    categories: [
      { id: 'signature-biryanis', name: 'Signature Biryanis', type: 'biryani' },
      { id: 'classic-biryanis', name: 'Classic Biryanis', type: 'biryani' },
      { id: 'kebabs', name: 'Kebabs', type: 'kebab' },
      { id: 'desserts', name: 'Desserts', type: 'dessert' }
    ],
    itemTemplates: [
      'Hyderabadi Biryani', 'Lucknowi Biryani', 'Kolkata Biryani', 'Awadhi Biryani',
      'Seekh Kebab', 'Reshmi Kebab', 'Tandoori Kebab', 'Shami Kebab'
    ]
  }
];

const generateItemName = (template, category, index) => {
  const variants = ['Special', 'Deluxe', 'Premium', 'Classic'];
  let name = template.replace('{category}', category.name);
  
  // Add variant if it's a duplicate
  if (index > 0 && !name.includes('Special') && !name.includes('Deluxe')) {
    name = `${variants[index % variants.length]} ${name}`;
  }
  
  return name;
};

const generateDescription = (itemName, categoryName, brandName) => {
  const descriptions = [
    `Delicious ${itemName.toLowerCase()} made with authentic spices and fresh ingredients`,
    `${brandName}'s signature ${itemName.toLowerCase()} - a customer favorite`,
    `Perfectly crafted ${itemName.toLowerCase()} served fresh and hot`,
    `Traditional ${itemName.toLowerCase()} with a modern twist`,
    `Chef's special ${itemName.toLowerCase()} prepared with premium ingredients`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const generateMenuData = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    console.log('=' .repeat(70));
    console.log('🎨 GENERATING FRESH MENU DATA FOR ALL RESTAURANTS');
    console.log('='.repeat(70));
    console.log('📝 4 items per category\n');

    let totalCategories = 0;
    let totalItems = 0;

    for (const brand of BRANDS) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`🍽️  ${brand.name} (${brand.productId})`);
      console.log('='.repeat(70));

      for (const category of brand.categories) {
        console.log(`\n📂 Category: ${category.name}`);

        // Create category
        const dbCategory = await Category.create({
          sourceId: category.id,
          productId: brand.productId,
          name: category.name,
          imageUrl: null,
        });
        
        console.log(`   ✅ Category created`);
        totalCategories++;

        // Generate 4 items for this category
        for (let i = 0; i < 4; i++) {
          const template = brand.itemTemplates[i] || brand.itemTemplates[0];
          const itemName = generateItemName(template, category, i);
          const basePrice = Math.floor(Math.random() * (400 - 150 + 1)) + 150;
          const membershipPrice = Math.floor(basePrice * 0.7);
          const isVeg = Math.random() > 0.4; // 60% veg

          console.log(`   ➕ ${i + 1}/4: Generating "${itemName}"`);
          console.log(`      📸 Uploading image to Cloudinary...`);

          const imageUrl = await uploadPlaceholderImage(itemName, category.type);

          await MenuItem.create({
            sourceId: `${category.id}-${Date.now()}-${i}`,
            brandId: brand.id,
            brandName: brand.name,
            categoryId: dbCategory._id.toString(),
            categorySourceId: category.id,
            categoryName: category.name,
            name: itemName,
            description: generateDescription(itemName, category.name, brand.name),
            price: basePrice,
            membershipPrice,
            isVeg,
            imageUrl,
            isAvailable: true,
          });

          console.log(`      ✅ Created: ${itemName}`);
          console.log(`      💰 ₹${basePrice} | Member: ₹${membershipPrice} | ${isVeg ? '🌿 Veg' : '🍖 Non-Veg'}`);
          totalItems++;

          await new Promise(resolve => setTimeout(resolve, 800));
        }

        console.log(`   ✅ Category "${category.name}" complete with 4 items`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 GENERATION COMPLETE');
    console.log('='.repeat(70));
    console.log(`✅ Total Categories Created: ${totalCategories}`);
    console.log(`✅ Total Items Created: ${totalItems}`);
    console.log('='.repeat(70));

    // Verify counts
    const finalCategories = await Category.countDocuments();
    const finalItems = await MenuItem.countDocuments();
    
    console.log(`\n📊 Database Verification:`);
    console.log(`   Categories in DB: ${finalCategories}`);
    console.log(`   Menu Items in DB: ${finalItems}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

generateMenuData();
