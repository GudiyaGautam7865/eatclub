# EatClub Orders API - Testing Guide

## 🚀 Quick Start

### Prerequisites
1. MongoDB running on `localhost:27017` or update `MONGODB_URI` in `.env`
2. Server running: `npm run dev` (in server folder)
3. Admin user seeded: `npm run seed:admin`

### Environment Setup
Create `.env` file in server folder:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eatclub
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
SEED_ADMIN_EMAIL=admin@eatclub.com
SEED_ADMIN_PASS=admin123
CORS_ORIGIN=http://localhost:5173
```

---

## 📝 API Endpoints Summary

### User Orders (Authentication Required)
- `POST /api/orders` - Create new order
- `GET /api/orders/my` - Get user's orders

### Bulk Orders (Public)
- `POST /api/bulk-orders` - Create bulk order

### Admin Orders (Admin Authentication Required)
- `GET /api/admin/orders/single` - Get all single orders
- `GET /api/admin/orders/bulk` - Get all bulk orders
- `PATCH /api/admin/orders/:id/status` - Update single order status
- `PATCH /api/admin/orders/bulk/:id/status` - Update bulk order status

---

## 🧪 Testing with cURL

### Step 1: Seed Admin User
```bash
npm run seed:admin
```

### Step 2: Login as Admin (Get Token)
**Note:** You'll need auth routes from Member A. For now, use this placeholder:

```bash
# Placeholder - Replace with actual auth endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eatclub.com",
    "password": "admin123"
  }'
```

Save the token from response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

Set token as variable:
```bash
# PowerShell
$TOKEN = "your_token_here"

# Bash/Linux
export TOKEN="your_token_here"
```

---

### Step 3: Create Order (User)

```bash
# PowerShell
curl -X POST http://localhost:5000/api/orders `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{
    \"items\": [
      {
        \"menuItemId\": \"item123\",
        \"name\": \"Butter Chicken\",
        \"qty\": 2,
        \"price\": 299
      },
      {
        \"menuItemId\": \"item456\",
        \"name\": \"Garlic Naan\",
        \"qty\": 4,
        \"price\": 50
      }
    ],
    \"total\": 798,
    \"payment\": {
      \"method\": \"COD\"
    },
    \"address\": {
      \"line1\": \"123 MG Road, Koramangala\",
      \"city\": \"Bangalore\",
      \"pincode\": \"560034\"
    }
  }'

# Bash/Linux
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "menuItemId": "item123",
        "name": "Butter Chicken",
        "qty": 2,
        "price": 299
      },
      {
        "menuItemId": "item456",
        "name": "Garlic Naan",
        "qty": 4,
        "price": 50
      }
    ],
    "total": 798,
    "payment": {
      "method": "COD"
    },
    "address": {
      "line1": "123 MG Road, Koramangala",
      "city": "Bangalore",
      "pincode": "560034"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "675723abc123def456789012",
    "user": "675712abc123def456789001",
    "items": [...],
    "total": 798,
    "status": "PLACED",
    "payment": { "method": "COD" },
    "address": {...},
    "isBulk": false,
    "createdAt": "2025-12-09T10:30:00.000Z",
    "updatedAt": "2025-12-09T10:30:00.000Z"
  }
}
```

---

### Step 4: Get User Orders

```bash
# PowerShell
curl http://localhost:5000/api/orders/my `
  -H "Authorization: Bearer $TOKEN"

# Bash/Linux
curl http://localhost:5000/api/orders/my \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "675723abc123def456789012",
      "user": "675712abc123def456789001",
      "items": [...],
      "total": 798,
      "status": "PLACED",
      "createdAt": "2025-12-09T10:30:00.000Z"
    }
  ]
}
```

---

### Step 5: Create Bulk Order (Public - No Auth)

```bash
# PowerShell
curl -X POST http://localhost:5000/api/bulk-orders `
  -H "Content-Type: application/json" `
  -d '{
    \"name\": \"John Doe\",
    \"phone\": \"+91-9876543210\",
    \"peopleCount\": 50,
    \"eventDateTime\": \"2025-12-15T18:00:00\",
    \"address\": \"Tech Park, Whitefield, Bangalore\",
    \"brandPreference\": \"Biryani Blues\",
    \"budgetPerHead\": 250
  }'

# Bash/Linux
curl -X POST http://localhost:5000/api/bulk-orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+91-9876543210",
    "peopleCount": 50,
    "eventDateTime": "2025-12-15T18:00:00",
    "address": "Tech Park, Whitefield, Bangalore",
    "brandPreference": "Biryani Blues",
    "budgetPerHead": 250
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Bulk order submitted successfully",
  "data": {
    "_id": "675724abc123def456789013",
    "name": "John Doe",
    "phone": "+91-9876543210",
    "peopleCount": 50,
    "eventDateTime": "2025-12-15T18:00:00",
    "address": "Tech Park, Whitefield, Bangalore",
    "brandPreference": "Biryani Blues",
    "budgetPerHead": 250,
    "status": "PENDING",
    "isBulk": true,
    "createdAt": "2025-12-09T10:35:00.000Z"
  }
}
```

---

### Step 6: Admin - Get All Single Orders

```bash
# PowerShell
curl http://localhost:5000/api/admin/orders/single `
  -H "Authorization: Bearer $TOKEN"

# Bash/Linux
curl http://localhost:5000/api/admin/orders/single \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "675723abc123def456789012",
      "user": {
        "_id": "675712abc123def456789001",
        "name": "Admin User",
        "email": "admin@eatclub.com"
      },
      "items": [...],
      "total": 798,
      "status": "PLACED",
      "createdAt": "2025-12-09T10:30:00.000Z"
    }
  ]
}
```

---

### Step 7: Admin - Get All Bulk Orders

```bash
# PowerShell
curl http://localhost:5000/api/admin/orders/bulk `
  -H "Authorization: Bearer $TOKEN"

# Bash/Linux
curl http://localhost:5000/api/admin/orders/bulk \
  -H "Authorization: Bearer $TOKEN"
```

---

### Step 8: Admin - Update Single Order Status

```bash
# PowerShell
curl -X PATCH http://localhost:5000/api/admin/orders/675723abc123def456789012/status `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{\"status\": \"PREPARING\"}'

# Bash/Linux
curl -X PATCH http://localhost:5000/api/admin/orders/675723abc123def456789012/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "PREPARING"}'
```

**Valid statuses:** `PLACED`, `PREPARING`, `DELIVERED`, `CANCELLED`

**Expected Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "675723abc123def456789012",
    "status": "PREPARING",
    "user": {...},
    ...
  }
}
```

---

### Step 9: Admin - Update Bulk Order Status

```bash
# PowerShell
curl -X PATCH http://localhost:5000/api/admin/orders/bulk/675724abc123def456789013/status `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{\"status\": \"CONFIRMED\"}'

# Bash/Linux
curl -X PATCH http://localhost:5000/api/admin/orders/bulk/675724abc123def456789013/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "CONFIRMED"}'
```

**Valid statuses:** `PENDING`, `CONFIRMED`, `DELIVERED`, `CANCELLED`

---

## 🧪 Testing with Postman

### Collection Setup

1. **Create Environment Variables:**
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (Set after login)
   - `orderId`: (Set after creating order)
   - `bulkOrderId`: (Set after creating bulk order)

2. **Import Collection:**

Create a new collection with these requests:

#### 1. Create Order
- Method: `POST`
- URL: `{{baseUrl}}/orders`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body (raw JSON):
```json
{
  "items": [
    {
      "menuItemId": "item123",
      "name": "Butter Chicken",
      "qty": 2,
      "price": 299
    }
  ],
  "total": 598,
  "payment": { "method": "COD" },
  "address": {
    "line1": "123 MG Road",
    "city": "Bangalore",
    "pincode": "560034"
  }
}
```

#### 2. Get My Orders
- Method: `GET`
- URL: `{{baseUrl}}/orders/my`
- Headers: `Authorization: Bearer {{token}}`

#### 3. Create Bulk Order
- Method: `POST`
- URL: `{{baseUrl}}/bulk-orders`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "John Doe",
  "phone": "+91-9876543210",
  "peopleCount": 50,
  "eventDateTime": "2025-12-15T18:00:00",
  "address": "Tech Park, Whitefield",
  "brandPreference": "Biryani Blues",
  "budgetPerHead": 250
}
```

#### 4. Admin - Get Single Orders
- Method: `GET`
- URL: `{{baseUrl}}/admin/orders/single`
- Headers: `Authorization: Bearer {{token}}`

#### 5. Admin - Get Bulk Orders
- Method: `GET`
- URL: `{{baseUrl}}/admin/orders/bulk`
- Headers: `Authorization: Bearer {{token}}`

#### 6. Admin - Update Order Status
- Method: `PATCH`
- URL: `{{baseUrl}}/admin/orders/{{orderId}}/status`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body:
```json
{
  "status": "PREPARING"
}
```

#### 7. Admin - Update Bulk Order Status
- Method: `PATCH`
- URL: `{{baseUrl}}/admin/orders/bulk/{{bulkOrderId}}/status`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body:
```json
{
  "status": "CONFIRMED"
}
```

---

## 🗄️ MongoDB Verification

### Connect to MongoDB
```bash
# MongoDB Shell
mongosh mongodb://localhost:27017/eatclub

# OR MongoDB Compass
# Connect to: mongodb://localhost:27017/eatclub
```

### Check Collections
```javascript
// Show all collections
show collections

// Count orders
db.orders.countDocuments()

// Find all orders
db.orders.find().pretty()

// Find all bulk orders
db.bulkorders.find().pretty()

// Find orders with user details
db.orders.find().populate('user')

// Find orders by status
db.orders.find({ status: 'PLACED' })

// Find bulk orders by status
db.bulkorders.find({ status: 'PENDING' })
```

---

## ✅ Test Checklist

- [ ] Server starts without errors (`npm run dev`)
- [ ] Admin user seeded successfully (`npm run seed:admin`)
- [ ] Health check works (`curl http://localhost:5000/health`)
- [ ] Create order with valid token (201 response)
- [ ] Create order without token (401 response)
- [ ] Get user orders with valid token (200 response)
- [ ] Create bulk order without auth (201 response)
- [ ] Admin can fetch all single orders (200 response)
- [ ] Admin can fetch all bulk orders (200 response)
- [ ] Admin can update single order status (200 response)
- [ ] Admin can update bulk order status (200 response)
- [ ] Non-admin user cannot access admin routes (403 response)
- [ ] Invalid status values are rejected (400 response)
- [ ] Orders are stored in MongoDB
- [ ] User field is populated in admin single orders list

---

## 🐛 Common Issues & Solutions

### Issue: "No token provided"
**Solution:** Ensure Authorization header is set: `Authorization: Bearer <token>`

### Issue: "Invalid or expired token"
**Solution:** Login again to get a fresh token (tokens expire after 7 days)

### Issue: "Admin access required"
**Solution:** Ensure you're using admin user token, not regular user token

### Issue: "Order must contain at least one item"
**Solution:** Ensure `items` array is not empty and each item has required fields

### Issue: "Address is required"
**Solution:** Ensure `address.line1` is provided in request body

### Issue: MongoDB connection error
**Solution:** Ensure MongoDB is running: `mongod` or check if using Atlas

### Issue: CORS error in frontend
**Solution:** Ensure `CORS_ORIGIN=http://localhost:5173` in `.env`

---

## 📸 Screenshots to Include in PR

1. **Postman/cURL - Create Order (Success)**
2. **Postman/cURL - Get User Orders**
3. **Postman/cURL - Admin Get Single Orders**
4. **Postman/cURL - Update Order Status**
5. **MongoDB Compass - Orders Collection**
6. **MongoDB Compass - BulkOrders Collection**
7. **Server Console - Running without errors**

---

## 🎯 Success Criteria

✅ All endpoints return expected responses  
✅ Authentication & authorization working correctly  
✅ Data persisted in MongoDB  
✅ User orders only show their own orders  
✅ Admin can see all orders and update status  
✅ Bulk orders can be created without authentication  
✅ Status updates validate against allowed values  
✅ User details populated in admin order lists  

---

**Need Help?** Check server logs for detailed error messages.
