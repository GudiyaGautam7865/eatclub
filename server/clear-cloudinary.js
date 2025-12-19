import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const clearCloudinary = async () => {
  try {
    console.log('🧹 Clearing Cloudinary images...\n');
    console.log('🔑 Using cloud:', process.env.CLOUDINARY_CLOUD_NAME);

    // Delete all resources in the eatclub/menu-items folder
    console.log('📂 Deleting folder: eatclub/menu-items');
    const deleteResult = await cloudinary.api.delete_resources_by_prefix('eatclub/menu-items', {
      resource_type: 'image',
      type: 'upload'
    });

    console.log('📋 Delete result:', JSON.stringify(deleteResult, null, 2));
    console.log(`✅ Deleted ${deleteResult.deleted ? Object.keys(deleteResult.deleted).length : 0} images`);

    // Delete the folder itself
    try {
      await cloudinary.api.delete_folder('eatclub/menu-items');
      console.log('✅ Deleted folder: eatclub/menu-items');
    } catch (folderError) {
      console.log('ℹ️  Folder may be already empty or doesn\'t exist:', folderError.message);
    }

    // Try deleting parent folder if empty
    try {
      await cloudinary.api.delete_folder('eatclub');
      console.log('✅ Deleted parent folder: eatclub');
    } catch (parentError) {
      console.log('ℹ️  Parent folder may contain other resources:', parentError.message);
    }

    console.log('\n🎉 Cloudinary cleanup complete!\n');

  } catch (error) {
    console.error('❌ Error clearing Cloudinary:', error);
    if (error.error && error.error.message) {
      console.error('Details:', error.error.message);
    }
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

clearCloudinary();
