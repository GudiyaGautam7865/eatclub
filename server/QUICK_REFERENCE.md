# 🚀 Quick Reference - Orders API

## Environment Setup
```bash
# 1. Create .env in server folder
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eatclub
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
SEED_ADMIN_EMAIL=admin@eatclub.com
SEED_ADMIN_PASS=admin123
CORS_ORIGIN=http://localhost:5173

# 2. Install & Run
cd server
npm install
npm run seed:admin
npm run dev
```

## 📍 All Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | User | Create order |
| GET | `/api/orders/my` | User | Get my orders |
| POST | `/api/bulk-orders` | Public | Create bulk order |
| GET | `/api/admin/orders/single` | Admin | List all single orders |
| GET | `/api/admin/orders/bulk` | Admin | List all bulk orders |
| PATCH | `/api/admin/orders/:id/status` | Admin | Update single order status |
| PATCH | `/api/admin/orders/bulk/:id/status` | Admin | Update bulk order status |

## 🔑 Get Token (PowerShell)
```powershell
# After Member A implements auth routes:
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body (@{email="admin@eatclub.com";password="admin123"} | ConvertTo-Json) -ContentType "application/json"
$TOKEN = $response.data.token
```

## 📦 Sample Requests

### Create Order
```powershell
curl -X POST http://localhost:5000/api/orders `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{\"items\":[{\"menuItemId\":\"123\",\"name\":\"Biryani\",\"qty\":2,\"price\":250}],\"total\":500,\"payment\":{\"method\":\"COD\"},\"address\":{\"line1\":\"MG Road\",\"city\":\"Bangalore\",\"pincode\":\"560001\"}}'
```

### Get My Orders
```powershell
curl http://localhost:5000/api/orders/my -H "Authorization: Bearer $TOKEN"
```

### Create Bulk Order (No Auth)
```powershell
curl -X POST http://localhost:5000/api/bulk-orders `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"John Doe\",\"phone\":\"+91-9876543210\",\"peopleCount\":50,\"eventDateTime\":\"2025-12-15T18:00:00\",\"address\":\"Tech Park\"}'
```

### Admin - Get All Single Orders
```powershell
curl http://localhost:5000/api/admin/orders/single -H "Authorization: Bearer $TOKEN"
```

### Admin - Update Order Status
```powershell
curl -X PATCH http://localhost:5000/api/admin/orders/ORDER_ID_HERE/status `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{\"status\":\"PREPARING\"}'
```

## ✅ Status Values

### Single Orders
- `PLACED` (default)
- `PREPARING`
- `DELIVERED`
- `CANCELLED`

### Bulk Orders
- `PENDING` (default)
- `CONFIRMED`
- `DELIVERED`
- `CANCELLED`

## 🗄️ MongoDB Check
```javascript
// In mongosh
use eatclub

// View orders
db.orders.find().pretty()

// View bulk orders
db.bulkorders.find().pretty()

// Count
db.orders.countDocuments()
db.bulkorders.countDocuments()
```

## 🐛 Common HTTP Status Codes

| Code | Meaning | Cause |
|------|---------|-------|
| 200 | Success | Request completed |
| 201 | Created | Order created |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Not admin |
| 404 | Not Found | Order doesn't exist |
| 500 | Server Error | Check server logs |

## 📂 File Structure
```
server/src/
├── models/
│   ├── Order.js (user, items, total, status, payment, address)
│   └── BulkOrder.js (name, phone, peopleCount, eventDateTime)
├── controllers/
│   ├── orderController.js (createOrder, getUserOrders)
│   ├── bulkOrderController.js (createBulkOrder)
│   └── admin/adminOrderController.js (getAllOrders, updateStatus)
└── routes/
    ├── orderRoutes.js
    ├── bulkOrderRoutes.js
    └── admin/adminOrderRoutes.js

client/src/services/
├── apiClient.js (centralized HTTP client)
├── ordersService.js (createOrderFromCart, getMyOrders)
├── bulkOrdersService.js (createBulkOrder)
└── adminOrdersService.js (getAdminOrders, updateOrderStatus)
```

## 🎯 Test Sequence
1. ✅ Start server: `npm run dev`
2. ✅ Seed admin: `npm run seed:admin`
3. ✅ Health check: `curl http://localhost:5000/health`
4. ✅ Login (get token) - **Need Member A's auth route**
5. ✅ Create order (with token)
6. ✅ Get my orders (with token)
7. ✅ Admin get all orders (with admin token)
8. ✅ Admin update status (with admin token)
9. ✅ Create bulk order (no token)
10. ✅ Verify in MongoDB

## 📸 Screenshot Checklist
- [ ] Successful order creation (201)
- [ ] Get user orders (200)
- [ ] Admin get all orders (200)
- [ ] Update order status (200)
- [ ] MongoDB orders collection
- [ ] MongoDB bulkorders collection

**For detailed testing:** See `TESTING_GUIDE.md`
