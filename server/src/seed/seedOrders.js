import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server root
dotenv.config({ path: join(__dirname, '../../.env') });

const seedOrders = async () => {
  try {
    await connectDB();
    console.log('🗄️  Connected to MongoDB');

    // Get or create test users
    let testUser = await User.findOne({ email: 'customer@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'John Doe',
        email: 'customer@example.com',
        phoneNumber: '9876543210',
        password: 'password123',
        role: 'USER',
        isActive: true,
        isEmailVerified: true,
      });
      console.log('✅ Test customer user created');
    }

    let testUser2 = await User.findOne({ email: 'customer2@example.com' });
    if (!testUser2) {
      testUser2 = await User.create({
        name: 'Jane Smith',
        email: 'customer2@example.com',
        phoneNumber: '9876543211',
        password: 'password123',
        role: 'USER',
        isActive: true,
        isEmailVerified: true,
      });
      console.log('✅ Test customer 2 user created');
    }

    let testUser3 = await User.findOne({ email: 'customer3@example.com' });
    if (!testUser3) {
      testUser3 = await User.create({
        name: 'Rahul Kumar',
        email: 'customer3@example.com',
        phoneNumber: '9876543212',
        password: 'password123',
        role: 'USER',
        isActive: true,
        isEmailVerified: true,
      });
      console.log('✅ Test customer 3 user created');
    }

    // Get or create driver users
    let driver1 = await User.findOne({ email: 'driver1@example.com' });
    if (!driver1) {
      driver1 = await User.create({
        name: 'Arjun Singh',
        email: 'driver1@example.com',
        phoneNumber: '9876543220',
        password: 'password123',
        role: 'USER',
        isActive: true,
        isEmailVerified: true,
      });
      console.log('✅ Test driver 1 user created');
    }

    let driver2 = await User.findOne({ email: 'driver2@example.com' });
    if (!driver2) {
      driver2 = await User.create({
        name: 'Priya Sharma',
        email: 'driver2@example.com',
        phoneNumber: '9876543221',
        password: 'password123',
        role: 'USER',
        isActive: true,
        isEmailVerified: true,
      });
      console.log('✅ Test driver 2 user created');
    }

    let driver3 = await User.findOne({ email: 'driver3@example.com' });
    if (!driver3) {
      driver3 = await User.create({
        name: 'Vikram Patel',
        email: 'driver3@example.com',
        phoneNumber: '9876543222',
        password: 'password123',
        role: 'USER',
        isActive: true,
        isEmailVerified: true,
      });
      console.log('✅ Test driver 3 user created');
    }

    // Get or create menu items for orders
    let biryani = await MenuItem.findOne({ name: 'Hyderabadi Biryani' });
    if (!biryani) {
      biryani = await MenuItem.create({
        brandId: 'brand-1',
        brandName: 'Biryani House',
        categoryId: 'cat-1',
        categoryName: 'Rice Dishes',
        name: 'Hyderabadi Biryani',
        description: 'Authentic Hyderabadi biryani with tender meat and fragrant rice',
        price: 350,
        membershipPrice: 280,
        isVeg: false,
        isAvailable: true,
      });
    }

    let paneerTikka = await MenuItem.findOne({ name: 'Paneer Tikka' });
    if (!paneerTikka) {
      paneerTikka = await MenuItem.create({
        brandId: 'brand-2',
        brandName: 'Spice Kitchen',
        categoryId: 'cat-2',
        categoryName: 'Appetizers',
        name: 'Paneer Tikka',
        description: 'Grilled paneer cubes with Indian spices',
        price: 250,
        membershipPrice: 200,
        isVeg: true,
        isAvailable: true,
      });
    }

    let butterChicken = await MenuItem.findOne({ name: 'Butter Chicken' });
    if (!butterChicken) {
      butterChicken = await MenuItem.create({
        brandId: 'brand-2',
        brandName: 'Spice Kitchen',
        categoryId: 'cat-3',
        categoryName: 'Curries',
        name: 'Butter Chicken',
        description: 'Tender chicken in creamy tomato butter sauce',
        price: 400,
        membershipPrice: 320,
        isVeg: false,
        isAvailable: true,
      });
    }

    let naan = await MenuItem.findOne({ name: 'Garlic Naan' });
    if (!naan) {
      naan = await MenuItem.create({
        brandId: 'brand-1',
        brandName: 'Biryani House',
        categoryId: 'cat-4',
        categoryName: 'Breads',
        name: 'Garlic Naan',
        description: 'Soft naan bread with garlic and butter',
        price: 80,
        membershipPrice: 65,
        isVeg: true,
        isAvailable: true,
      });
    }

    let gulabjamun = await MenuItem.findOne({ name: 'Gulab Jamun' });
    if (!gulabjamun) {
      gulabjamun = await MenuItem.create({
        brandId: 'brand-3',
        brandName: 'Sweet Delights',
        categoryId: 'cat-5',
        categoryName: 'Desserts',
        name: 'Gulab Jamun',
        description: 'Soft milk solids in sugar syrup',
        price: 120,
        membershipPrice: 100,
        isVeg: true,
        isAvailable: true,
      });
    }

    let lassi = await MenuItem.findOne({ name: 'Mango Lassi' });
    if (!lassi) {
      lassi = await MenuItem.create({
        brandId: 'brand-3',
        brandName: 'Sweet Delights',
        categoryId: 'cat-6',
        categoryName: 'Beverages',
        name: 'Mango Lassi',
        description: 'Refreshing yogurt-based drink with mango',
        price: 100,
        membershipPrice: 85,
        isVeg: true,
        isAvailable: true,
      });
    }



    // Create multiple sample orders with different statuses
    const orders = [
      {
        user: testUser._id,
        items: [
          {
            menuItemId: biryani._id.toString(),
            name: biryani.name,
            qty: 2,
            price: biryani.price,
          },
          {
            menuItemId: naan._id.toString(),
            name: naan.name,
            qty: 2,
            price: naan.price,
          },
        ],
        total: biryani.price * 2 + naan.price * 2,
        status: 'PLACED',
        payment: {
          method: 'COD',
        },
        address: {
          line1: '123 MG Road, Bangalore',
          city: 'Bangalore',
          pincode: '560001',
        },
        driverId: driver1._id,
        driverName: driver1.name,
        driverPhone: driver1.phoneNumber,
        isBulk: false,
      },
      {
        user: testUser._id,
        items: [
          {
            menuItemId: paneerTikka._id.toString(),
            name: paneerTikka.name,
            qty: 1,
            price: paneerTikka.price,
          },
          {
            menuItemId: butterChicken._id.toString(),
            name: butterChicken.name,
            qty: 1,
            price: butterChicken.price,
          },
          {
            menuItemId: naan._id.toString(),
            name: naan.name,
            qty: 3,
            price: naan.price,
          },
          {
            menuItemId: lassi._id.toString(),
            name: lassi.name,
            qty: 2,
            price: lassi.price,
          },
        ],
        total: paneerTikka.price + butterChicken.price + naan.price * 3 + lassi.price * 2,
        status: 'PREPARING',
        payment: {
          method: 'ONLINE',
          txId: 'TXN20231210001',
        },
        address: {
          line1: '456 Koramangala, Bangalore',
          city: 'Bangalore',
          pincode: '560034',
        },
        driverId: driver2._id,
        driverName: driver2.name,
        driverPhone: driver2.phoneNumber,
        isBulk: false,
      },
      {
        user: testUser2._id,
        items: [
          {
            menuItemId: biryani._id.toString(),
            name: biryani.name,
            qty: 3,
            price: biryani.price,
          },
          {
            menuItemId: gulabjamun._id.toString(),
            name: gulabjamun.name,
            qty: 1,
            price: gulabjamun.price,
          },
        ],
        total: biryani.price * 3 + gulabjamun.price,
        status: 'DELIVERED',
        payment: {
          method: 'ONLINE',
          txId: 'TXN20231210002',
        },
        address: {
          line1: '789 Indiranagar, Bangalore',
          city: 'Bangalore',
          pincode: '560038',
        },
        driverId: driver3._id,
        driverName: driver3.name,
        driverPhone: driver3.phoneNumber,
        isBulk: false,
      },
      {
        user: testUser2._id,
        items: [
          {
            menuItemId: butterChicken._id.toString(),
            name: butterChicken.name,
            qty: 2,
            price: butterChicken.price,
          },
          {
            menuItemId: naan._id.toString(),
            name: naan.name,
            qty: 4,
            price: naan.price,
          },
          {
            menuItemId: lassi._id.toString(),
            name: lassi.name,
            qty: 4,
            price: lassi.price,
          },
        ],
        total: butterChicken.price * 2 + naan.price * 4 + lassi.price * 4,
        status: 'CANCELLED',
        payment: {
          method: 'COD',
        },
        address: {
          line1: '321 Whitefield, Bangalore',
          city: 'Bangalore',
          pincode: '560066',
        },
        isBulk: false,
      },
      {
        user: testUser3._id,
        items: [
          {
            menuItemId: paneerTikka._id.toString(),
            name: paneerTikka.name,
            qty: 5,
            price: paneerTikka.price,
          },
          {
            menuItemId: butterChicken._id.toString(),
            name: butterChicken.name,
            qty: 5,
            price: butterChicken.price,
          },
          {
            menuItemId: naan._id.toString(),
            name: naan.name,
            qty: 10,
            price: naan.price,
          },
          {
            menuItemId: gulabjamun._id.toString(),
            name: gulabjamun.name,
            qty: 2,
            price: gulabjamun.price,
          },
        ],
        total: paneerTikka.price * 5 + butterChicken.price * 5 + naan.price * 10 + gulabjamun.price * 2,
        status: 'PLACED',
        payment: {
          method: 'ONLINE',
          txId: 'TXN20231210003',
        },
        address: {
          line1: '654 Marathahalli, Bangalore',
          city: 'Bangalore',
          pincode: '560037',
        },
        driverId: driver1._id,
        driverName: driver1.name,
        driverPhone: driver1.phoneNumber,
        isBulk: true,
      },
      {
        user: testUser3._id,
        items: [
          {
            menuItemId: biryani._id.toString(),
            name: biryani.name,
            qty: 1,
            price: biryani.price,
          },
          {
            menuItemId: paneerTikka._id.toString(),
            name: paneerTikka.name,
            qty: 1,
            price: paneerTikka.price,
          },
          {
            menuItemId: naan._id.toString(),
            name: naan.name,
            qty: 2,
            price: naan.price,
          },
          {
            menuItemId: gulabjamun._id.toString(),
            name: gulabjamun.name,
            qty: 1,
            price: gulabjamun.price,
          },
        ],
        total: biryani.price + paneerTikka.price + naan.price * 2 + gulabjamun.price,
        status: 'PREPARING',
        payment: {
          method: 'COD',
        },
        address: {
          line1: '999 Jayanagar, Bangalore',
          city: 'Bangalore',
          pincode: '560041',
        },
        driverId: driver2._id,
        driverName: driver2.name,
        driverPhone: driver2.phoneNumber,
        isBulk: false,
      },
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ ${createdOrders.length} sample orders created successfully`);
    
    createdOrders.forEach((order, index) => {
      console.log(`   Order ${index + 1}:`);
      console.log(`     - ID: ${order._id}`);
      console.log(`     - Customer: ${order.user}`);
      console.log(`     - Total: ₹${order.total}`);
      console.log(`     - Status: ${order.status}`);
      console.log(`     - Items: ${order.items.length}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedOrders();
