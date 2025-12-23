import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const ADMIN_DATA = {
  name: 'Admin',
  email: process.env.SEED_ADMIN_EMAIL || 'admin@eatclub.com',
  password: process.env.SEED_ADMIN_PASS || '12601260',
  role: 'ADMIN',
  isActive: true,
  isEmailVerified: true,
};

async function seedAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_DATA.email, role: 'ADMIN' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email);
      console.log('Updating password...');
      
      existingAdmin.password = ADMIN_DATA.password;
      await existingAdmin.save();
      
      console.log('✓ Admin password updated');
    } else {
      // Create new admin
      const admin = await User.create(ADMIN_DATA);
      console.log('✓ Admin user created successfully');
      console.log('Email:', admin.email);
      console.log('Password:', ADMIN_DATA.password);
    }

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
