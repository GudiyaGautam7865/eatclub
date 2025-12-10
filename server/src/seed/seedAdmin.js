import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import connectDB from '../config/db.js';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server root
dotenv.config({ path: join(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log('🗄️  Connected to MongoDB');

    const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASS } = process.env;

    if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASS) {
      console.error('❌ SEED_ADMIN_EMAIL and SEED_ADMIN_PASS must be set in .env');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: SEED_ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`⚠️  Admin user with email ${SEED_ADMIN_EMAIL} already exists`);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASS,
      role: 'ADMIN',
      isActive: true,
      isEmailVerified: true,
    });

    console.log(`✅ Admin user created successfully`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
