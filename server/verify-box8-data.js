import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './src/models/MenuItem.js';
import Category from './src/models/Category.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI).then(async () => {
  console.log('✅ Connected to MongoDB\n');
  
  const menuPath = path.join(__dirname, '..', 'client', 'public', 'data', 'menus', 'box8-menu.json');
  const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf-8'));
  
  console.log('=' .repeat(70));
  console.log('📊 BOX8 DATA VERIFICATION');
  console.log('='.repeat(70));
  
  const totalDbItems = await MenuItem.countDocuments({ brandId: '3' });
  console.log(`\n📦 Total BOX8 Items in Database: ${totalDbItems}`);
  
  console.log('\n' + '─'.repeat(70));
  console.log('Category Breakdown:');
  console.log('─'.repeat(70));
  console.log('Category Name                    | JSON | DB   | Status');
  console.log('─'.repeat(70));
  
  let allMatch = true;
  
  for (const cat of menuData.categories) {
    const jsonCount = menuData.items.filter(item => item.categoryId === cat.id).length;
    const dbCount = await MenuItem.countDocuments({
      brandId: '3',
      categorySourceId: cat.id
    });
    
    const status = jsonCount === dbCount ? '✅ Match' : `❌ Missing ${jsonCount - dbCount}`;
    if (jsonCount !== dbCount) allMatch = false;
    
    const catName = cat.name.padEnd(32);
    const jsonStr = String(jsonCount).padStart(4);
    const dbStr = String(dbCount).padStart(4);
    
    console.log(`${catName} | ${jsonStr} | ${dbStr} | ${status}`);
  }
  
  console.log('─'.repeat(70));
  
  if (allMatch) {
    console.log('\n🎉 SUCCESS! All categories match perfectly!');
  } else {
    console.log('\n⚠️  Some categories still have mismatches');
  }
  
  // Show sample items from each category
  console.log('\n' + '='.repeat(70));
  console.log('Sample Items (2 per category):');
  console.log('='.repeat(70));
  
  for (const cat of menuData.categories) {
    const items = await MenuItem.find({
      brandId: '3',
      categorySourceId: cat.id
    }).limit(2);
    
    if (items.length > 0) {
      console.log(`\n📂 ${cat.name}:`);
      items.forEach(item => {
        console.log(`   • ${item.name} - ₹${item.price} (${item.isVeg ? '🌿 Veg' : '🍖 Non-Veg'})`);
      });
    }
  }
  
  console.log('\n' + '='.repeat(70));
  
  process.exit(0);
});
