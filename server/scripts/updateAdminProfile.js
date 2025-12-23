import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from server/.env
dotenv.config({ path: join(__dirname, '../.env') });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASS || '1260';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER || '9999999999';
const ADMIN_PHONE = process.env.ADMIN_PHONE || ADMIN_PHONE_NUMBER;

async function upsertAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await connectDB();

  let admin = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

  if (!admin) {
    admin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'ADMIN',
      phoneNumber: ADMIN_PHONE_NUMBER,
      phone: ADMIN_PHONE,
      isActive: true,
      isEmailVerified: true,
    });
    await admin.save();
    console.log('✅ Admin created', {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      phoneNumber: admin.phoneNumber,
    });
    await mongoose.disconnect();
    process.exit(0);
  }

  admin.name = ADMIN_NAME;
  admin.role = 'ADMIN';
  admin.isActive = true;
  admin.isEmailVerified = true;
  admin.phoneNumber = ADMIN_PHONE_NUMBER;
  admin.phone = ADMIN_PHONE;
  if (ADMIN_PASSWORD) {
    admin.password = ADMIN_PASSWORD; // will hash on save via pre-save hook
  }

  await admin.save();
  console.log('✅ Admin updated', {
    id: admin._id.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
    phoneNumber: admin.phoneNumber,
  });
  await mongoose.disconnect();
  process.exit(0);
}

upsertAdmin().catch(async (err) => {
  console.error('❌ Failed to upsert admin:', err.message);
  await mongoose.disconnect();
  process.exit(1);
});
