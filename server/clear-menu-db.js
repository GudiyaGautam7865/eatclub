import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './src/models/MenuItem.js';
import Category from './src/models/Category.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Count before deletion
    const itemsCount = await MenuItem.countDocuments();
    const categoriesCount = await Category.countDocuments();

    console.log('📊 Current Database Status:');
    console.log(`   Menu Items: ${itemsCount}`);
    console.log(`   Categories: ${categoriesCount}\n`);

    if (itemsCount === 0 && categoriesCount === 0) {
      console.log('✅ Database is already empty!');
      process.exit(0);
    }

    // Delete all menu items
    console.log('🗑️  Deleting all menu items...');
    const deletedItems = await MenuItem.deleteMany({});
    console.log(`✅ Deleted ${deletedItems.deletedCount} menu items`);

    // Delete all categories
    console.log('🗑️  Deleting all categories...');
    const deletedCategories = await Category.deleteMany({});
    console.log(`✅ Deleted ${deletedCategories.deletedCount} categories`);

    console.log('\n🎉 Database cleared successfully!');

    // Verify
    const finalItems = await MenuItem.countDocuments();
    const finalCategories = await Category.countDocuments();
    
    console.log('\n📊 Final Database Status:');
    console.log(`   Menu Items: ${finalItems}`);
    console.log(`   Categories: ${finalCategories}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

clearDatabase();
