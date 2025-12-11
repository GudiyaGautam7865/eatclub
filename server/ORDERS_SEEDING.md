# Order Seeding Guide

This document explains how to seed valid order data into the backend database.

## Overview

The `seedOrders.js` script creates sample order data with:
- 3 test customer users
- 7 different menu items (various dishes, breads, desserts, and beverages)
- 6 sample orders with different statuses (PLACED, PREPARING, DELIVERED, CANCELLED)
- Realistic addresses and pricing

## Running the Seed

### Prerequisites
1. Ensure MongoDB is running
2. `.env` file is configured with `MONGODB_URI`
3. Install dependencies: `npm install` (from server directory)

### Run the Seed Script

```bash
# From the server directory
npm run seed:orders
```

### Output Example
```
🗄️  Connected to MongoDB
✅ Test customer user created
✅ Test customer 2 user created
✅ Test customer 3 user created
✅ 6 sample orders created successfully
   Order 1:
     - ID: 653f8a1b2c3d4e5f6g7h8i9j
     - Customer: 653f7a1b2c3d4e5f6g7h8i9j
     - Total: ₹1260
     - Status: PLACED
     - Items: 2
   Order 2:
     - ID: 653f8a1b2c3d4e5f6g7h8i9k
     - Customer: 653f7a1b2c3d4e5f6g7h8i9j
     - Total: ₹1390
     - Status: PREPARING
     - Items: 4
   ... (and more)
```

## Test User Credentials

Use these credentials to log in and test orders:

| Email | Password | Name | Phone |
|-------|----------|------|-------|
| customer@example.com | password123 | John Doe | 9876543210 |
| customer2@example.com | password123 | Jane Smith | 9876543211 |
| customer3@example.com | password123 | Rahul Kumar | 9876543212 |

## Sample Data Created

### Menu Items
- **Hyderabadi Biryani** - ₹350 (Non-veg, Rice Dishes)
- **Paneer Tikka** - ₹250 (Veg, Appetizers)
- **Butter Chicken** - ₹400 (Non-veg, Curries)
- **Garlic Naan** - ₹80 (Veg, Breads)
- **Gulab Jamun** - ₹120 (Veg, Desserts)
- **Mango Lassi** - ₹100 (Veg, Beverages)

### Order Statuses
- **PLACED** - Initial order status
- **PREPARING** - Order is being prepared
- **DELIVERED** - Order has been delivered
- **CANCELLED** - Order was cancelled

## Payment Methods
Orders are created with:
- **COD** (Cash on Delivery) - Some orders
- **ONLINE** - Some orders with transaction IDs (TXN20231210001, etc.)

## Addresses
All sample orders are in Bangalore with realistic address details:
- Line 1: Street address
- City: Bangalore
- Pincode: Various postal codes (560001, 560034, 560038, etc.)

## Idempotency
The script checks if orders already exist in the database:
- If orders exist, it displays a warning and exits without creating duplicates
- This prevents accidental duplicate data creation

## Database Reset (if needed)

To clear all orders and start fresh:

```bash
# This would require a MongoDB command or a separate cleanup script
# For now, manually delete orders via MongoDB Compass or mongosh:
# db.orders.deleteMany({})
```

## Notes

- Each order includes realistic item quantities and calculated totals
- One order is marked as `isBulk: true` (bulk order for bulk orders feature)
- Menu items are created with membership prices for member discounts
- All test data uses Bangalore as the city for consistency
