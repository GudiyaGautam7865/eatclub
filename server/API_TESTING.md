# EatClub API Testing Guide

Complete guide for testing all backend endpoints.

## 🚀 Setup

### 1. Start Server
```powershell
cd server
npm run dev
```
```
## 📋 All API Endpoints

### Authentication Endpoints

#### 1. Register New User
```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Vivek\",\"email\":\"vivek@example.com\",\"password\":\"Password@123\"}"
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "Vivek",
      "email": "vivek@example.com",
      "role": "USER"
    }
  }
}
```

#### 2. Login User
```powershell
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"vivek@example.com\",\"password\":\"Password@123\"}"
```

#### 3. Login Admin
```powershell
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@eatclub.com\",\"password\":\"Admin@123\"}"
```

**Save the token for subsequent requests:**
```powershell
# PowerShell - Set token variable
$TOKEN = "paste_your_token_here"
```

---

### Order Endpoints (User - Requires Auth)

#### 4. Create Order
```powershell
curl -X POST http://localhost:5000/api/orders -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"items\":[{\"menuItemId\":\"675712abc123def456789001\",\"name\":\"Chicken Biryani\",\"qty\":2,\"price\":299},{\"menuItemId\":\"675712abc123def456789002\",\"name\":\"Paneer Tikka\",\"qty\":1,\"price\":199}],\"total\":797,\"payment\":{\"method\":\"COD\"},\"address\":{\"line1\":\"123 Main Street, Apartment 4B\",\"city\":\"Mumbai\",\"pincode\":\"400001\"}}"
```

**Formatted Request Body:**
```json
{
  "items": [
    {
      "menuItemId": "675712abc123def456789001",
      "name": "Chicken Biryani",
      "qty": 2,
      "price": 299
    },
    {
      "menuItemId": "675712abc123def456789002",
      "name": "Paneer Tikka",
      "qty": 1,
      "price": 199
    }
  ],
  "total": 797,
  "payment": {
    "method": "COD"
  },
  "address": {
    "line1": "123 Main Street, Apartment 4B",
    "city": "Mumbai",
    "pincode": "400001"
  }
}
```

#### 5. Get My Orders
```powershell
curl -X GET http://localhost:5000/api/orders/my -H "Authorization: Bearer $TOKEN"
```

---

### Bulk Order Endpoints

#### 6. Create Bulk Order (Public - No Auth)
```powershell
curl -X POST http://localhost:5000/api/bulk-orders -H "Content-Type: application/json" -d "{\"name\":\"Rajesh Kumar\",\"phone\":\"9876543210\",\"peopleCount\":50,\"eventDateTime\":\"2025-12-20T18:00:00.000Z\",\"address\":\"Corporate Park, Sector 21, Gurugram\",\"brandPreference\":\"Faasos\",\"budgetPerHead\":250}"
```

**Formatted Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "peopleCount": 50,
  "eventDateTime": "2025-12-20T18:00:00.000Z",
  "address": "Corporate Park, Sector 21, Gurugram",
  "brandPreference": "Faasos",
  "budgetPerHead": 250
}
```

#### 7. Get My Bulk Orders (Requires Auth)
```powershell
curl -X GET http://localhost:5000/api/bulk-orders/my -H "Authorization: Bearer $TOKEN"
```

---

### Admin Order Management (Requires Admin Auth)

**First, login as admin and save token:**
```powershell
$ADMIN_TOKEN = "paste_admin_token_here"
```

#### 8. Get All Single Orders (Admin)
```powershell
curl -X GET http://localhost:5000/api/admin/orders/single -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### 9. Get All Bulk Orders (Admin)
```powershell
curl -X GET http://localhost:5000/api/admin/orders/bulk -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### 10. Update Single Order Status (Admin)
```powershell
# Replace ORDER_ID with actual order ID
curl -X PATCH http://localhost:5000/api/admin/orders/ORDER_ID/status -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d "{\"status\":\"PREPARING\"}"
```

**Valid Status Values:**
- `PLACED`
- `PREPARING`
- `DELIVERED`
- `CANCELLED`

#### 11. Update Bulk Order Status (Admin)
```powershell
# Replace BULK_ORDER_ID with actual bulk order ID
curl -X PATCH http://localhost:5000/api/admin/orders/bulk/BULK_ORDER_ID/status -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d "{\"status\":\"CONFIRMED\"}"
```

**Valid Status Values:**
- `PENDING`
- `CONFIRMED`
- `DELIVERED`
- `CANCELLED`

---

### Admin Menu Management (Requires Admin Auth)

#### 12. Create Menu Item (Admin)
```powershell
curl -X POST http://localhost:5000/api/admin/menu/items -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d "{\"brandId\":\"faasos\",\"brandName\":\"Faasos\",\"categoryId\":\"wraps\",\"categoryName\":\"Wraps\",\"name\":\"Chicken Tikka Wrap\",\"description\":\"Juicy chicken tikka wrapped in soft roti\",\"price\":149,\"membershipPrice\":129,\"isVeg\":false,\"imageUrl\":\"https://example.com/tikka-wrap.jpg\",\"isAvailable\":true}"
```

**Formatted Request Body:**
```json
{
  "brandId": "faasos",
  "brandName": "Faasos",
  "categoryId": "wraps",
  "categoryName": "Wraps",
  "name": "Chicken Tikka Wrap",
  "description": "Juicy chicken tikka wrapped in soft roti",
  "price": 149,
  "membershipPrice": 129,
  "isVeg": false,
  "imageUrl": "https://example.com/tikka-wrap.jpg",
  "isAvailable": true
}
```

#### 13. Get All Menu Items (Admin)
```powershell
# Get all items
curl -X GET http://localhost:5000/api/admin/menu/items -H "Authorization: Bearer $ADMIN_TOKEN"

# Filter by brand
curl -X GET "http://localhost:5000/api/admin/menu/items?brandId=faasos" -H "Authorization: Bearer $ADMIN_TOKEN"

# Filter by category
curl -X GET "http://localhost:5000/api/admin/menu/items?categoryId=wraps" -H "Authorization: Bearer $ADMIN_TOKEN"

# Search by name
curl -X GET "http://localhost:5000/api/admin/menu/items?search=chicken" -H "Authorization: Bearer $ADMIN_TOKEN"

# Combine filters
curl -X GET "http://localhost:5000/api/admin/menu/items?brandId=faasos&categoryId=wraps&search=tikka" -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 🔄 Complete Testing Workflow

### Scenario 1: User Places Order

```powershell
# 1. Register
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"Pass@123\"}"

# 2. Save token from response
$TOKEN = "your_token_here"

# 3. Create order
curl -X POST http://localhost:5000/api/orders -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"items\":[{\"menuItemId\":\"item1\",\"name\":\"Biryani\",\"qty\":1,\"price\":299}],\"total\":299,\"payment\":{\"method\":\"COD\"},\"address\":{\"line1\":\"123 Street\",\"city\":\"Mumbai\",\"pincode\":\"400001\"}}"

# 4. Check my orders
curl -X GET http://localhost:5000/api/orders/my -H "Authorization: Bearer $TOKEN"
```

### Scenario 2: Admin Manages Orders

```powershell
# 1. Login as admin
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@eatclub.com\",\"password\":\"Admin@123\"}"

# 2. Save admin token
$ADMIN_TOKEN = "your_admin_token_here"

# 3. View all orders
curl -X GET http://localhost:5000/api/admin/orders/single -H "Authorization: Bearer $ADMIN_TOKEN"

# 4. Update order status (use order ID from step 3)
curl -X PATCH http://localhost:5000/api/admin/orders/ORDER_ID/status -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d "{\"status\":\"DELIVERED\"}"
```

### Scenario 3: Admin Manages Menu

```powershell
# 1. Login as admin
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@eatclub.com\",\"password\":\"Admin@123\"}"

# 2. Save admin token
$ADMIN_TOKEN = "your_admin_token_here"

# 3. Add menu item
curl -X POST http://localhost:5000/api/admin/menu/items -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d "{\"brandId\":\"faasos\",\"brandName\":\"Faasos\",\"categoryId\":\"biryani\",\"categoryName\":\"Biryani\",\"name\":\"Hyderabadi Biryani\",\"description\":\"Authentic Hyderabadi biryani\",\"price\":299,\"membershipPrice\":249,\"isVeg\":false}"

# 4. List all menu items
curl -X GET http://localhost:5000/api/admin/menu/items -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 🐛 Troubleshooting

### Issue: "jwt malformed" or "No token provided"
**Solution:** Make sure you're including the Authorization header with Bearer token:
```powershell
-H "Authorization: Bearer $TOKEN"
```

### Issue: "Access denied. Admins only"
**Solution:** Login with admin credentials and use admin token:
```powershell
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@eatclub.com\",\"password\":\"Admin@123\"}"
```

### Issue: Database connection error
**Solution:** Check MongoDB is running and `.env` has correct `MONGODB_URI`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.net/eatclub?retryWrites=true&w=majority
```

### Issue: Server shows wrong database name
**Solution:** Ensure your `.env` has `/eatclub` at the end of MONGODB_URI (not `/test`)

---

## 📊 Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔐 Authentication

- **User endpoints** require `Authorization: Bearer <user_token>`
- **Admin endpoints** require `Authorization: Bearer <admin_token>` (where user has role='ADMIN')
- **Public endpoints** (like bulk order creation) don't require authentication

Get tokens by calling `/api/auth/login` or `/api/auth/register`.
