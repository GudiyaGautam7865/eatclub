import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server root
dotenv.config({ path: join(__dirname, '../../.env') });

/**
 * ONE-TIME MIGRATION SCRIPT
 * 
 * This script migrates data from the "test" database to the "eatclub" database.
 * 
 * It will:
 * 1. Connect to MongoDB using the URI from .env (should point to "eatclub")
 * 2. Copy documents from test.users, test.orders, test.bulkorders, test.menuitems
 * 3. Insert them into eatclub collections (skipping duplicates based on _id)
 * 
 * Usage: npm run migrate:test-to-eatclub
 * 
 * WARNING: Run this only once! After migration, remove the "test" database manually if needed.
 */

const migrateTestToEatclub = async () => {
  try {
    console.log('🔄 Starting migration from "test" to "eatclub" database...\n');

    // Connect to MongoDB (should be pointing to "eatclub" via MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✓ Connected to MongoDB: ${mongoose.connection.host}`);
    console.log(`✓ Target database: ${mongoose.connection.name}\n`);

    if (mongoose.connection.name !== 'eatclub') {
      console.error('❌ ERROR: Connected database is not "eatclub"');
      console.error('   Please update MONGODB_URI in .env to end with /eatclub');
      process.exit(1);
    }

    // Get native MongoDB client
    const client = mongoose.connection.getClient();
    const testDB = client.db('test');
    const eatclubDB = client.db('eatclub');

    // Collections to migrate
    const collections = ['users', 'orders', 'bulkorders', 'menuitems'];

    let totalMigrated = 0;
    let totalSkipped = 0;

    for (const collectionName of collections) {
      console.log(`\n📦 Migrating "${collectionName}"...`);

      try {
        const sourceCollection = testDB.collection(collectionName);
        const targetCollection = eatclubDB.collection(collectionName);

        // Get all documents from test database
        const documents = await sourceCollection.find({}).toArray();
        console.log(`   Found ${documents.length} documents in test.${collectionName}`);

        if (documents.length === 0) {
          console.log(`   ⏭️  Skipping (no documents to migrate)`);
          continue;
        }

        let migrated = 0;
        let skipped = 0;

        // Insert each document into eatclub database (skip if _id exists)
        for (const doc of documents) {
          try {
            // Check if document with same _id already exists
            const existing = await targetCollection.findOne({ _id: doc._id });
            
            if (existing) {
              skipped++;
            } else {
              await targetCollection.insertOne(doc);
              migrated++;
            }
          } catch (error) {
            if (error.code === 11000) {
              // Duplicate key error (already exists)
              skipped++;
            } else {
              console.error(`   ⚠️  Error migrating document ${doc._id}:`, error.message);
            }
          }
        }

        console.log(`   ✅ Migrated: ${migrated} documents`);
        console.log(`   ⏭️  Skipped: ${skipped} documents (already exist)`);

        totalMigrated += migrated;
        totalSkipped += skipped;

      } catch (error) {
        console.error(`   ❌ Error with collection "${collectionName}":`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Total documents migrated: ${totalMigrated}`);
    console.log(`⏭️  Total documents skipped: ${totalSkipped}`);
    console.log('='.repeat(60));

    console.log('\n✨ Migration completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Verify data in "eatclub" database using MongoDB Compass or mongosh');
    console.log('   2. Test your application to ensure it works correctly');
    console.log('   3. Once verified, you can manually drop the "test" database');
    console.log('   4. Remove this migration script or keep it for reference\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run migration
migrateTestToEatclub();
