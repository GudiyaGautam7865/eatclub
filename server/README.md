

# EatClub Server - Backend API

Express.js + MongoDB + Mongoose backend for the EatClub food ordering platform.

## Quick Start

### 1. Setup Environment

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eatclub
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
SEED_ADMIN_EMAIL=admin@eatclub.com
SEED_ADMIN_PASS=admin123
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas by setting MONGODB_URI in .env
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 5. Seed Initial Data (Optional)

```bash
# Seed menu data
npm run seed

# Create admin user
npm run seed:admin
```

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with auto-reload |
| `npm start` | Start production server |
| `npm run seed` | Populate menu database with sample data |
| `npm run seed:admin` | Create admin user from .env credentials |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` \| `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/eatclub` |
| `JWT_SECRET` | JWT signing key (change in production!) | `your_secret_key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `SEED_ADMIN_EMAIL` | Admin email for seeding | `admin@eatclub.com` |
| `SEED_ADMIN_PASS` | Admin password for seeding | `admin123` |
| `CORS_ORIGIN` | Client origin for CORS | `http://localhost:5173` |
| `LOG_LEVEL` | Logging verbosity | `debug` \| `info` \| `warn` \| `error` |

## Project Structure

```
server/
├── src/
│   ├── config/           # Configuration (db connection)
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route mounting
│   ├── utils/            # Utility functions
│   ├── controllers/      # Business logic (coming soon)
│   ├── models/           # Mongoose schemas (coming soon)
│   ├── seed/             # Data seeding scripts (coming soon)
│   └── server.js         # Entry point
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
└── README.md             # This file
```

## Health Check

```bash
curl http://localhost:5000/health
```

Should return:
```json
{ "status": "Server is running" }
```

## Notes

- **Never commit `.env`** - Use `.env.example` instead
- **Change `JWT_SECRET` in production**
- **Use MongoDB Atlas for production** - Update `MONGODB_URI` connection string
### 5. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 6. Seed Initial Data (Optional)

```bash
# Seed menu brands, categories, and items
npm run seed

# Seed admin users
npm run seed:admin
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/eatclub` |
| `JWT_SECRET` | JWT signing secret | Required in production |
| `JWT_EXPIRE` | JWT expiration | `7d` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | Required |
| `CORS_ORIGIN` | Client origin for CORS | `http://localhost:5173` |
| `LOG_LEVEL` | Logging level | `debug` |

## 📡 API Routes

### Public Routes

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires auth)

#### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/all` - Get all users (admin only)

#### Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Create new address
- `PUT /api/addresses/:addressId` - Update address
- `DELETE /api/addresses/:addressId` - Delete address

#### Menu
- `GET /api/menu/brands` - Get all brands
- `GET /api/menu/brands/:brandId/categories` - Get brand categories
- `GET /api/menu/items` - Get menu items (supports filtering and pagination)
- `GET /api/menu/items/:itemId` - Get single menu item

#### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:orderId` - Get single order

#### Bulk Orders
- `POST /api/bulk-orders` - Create bulk order request
- `GET /api/bulk-orders` - Get all bulk orders
- `GET /api/bulk-orders/:orderId` - Get single bulk order

### Admin Routes

#### Admin Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout

#### Admin Menu Management
- `POST /api/admin/menu/brands` - Create brand
- `PUT /api/admin/menu/brands/:brandId` - Update brand
- `POST /api/admin/menu/items` - Create menu item
- `PUT /api/admin/menu/items/:itemId` - Update menu item
- `DELETE /api/admin/menu/items/:itemId` - Delete menu item

#### Admin Orders
- `GET /api/admin/orders/single` - Get all single orders
- `PATCH /api/admin/orders/single/:orderId/status` - Update order status
- `GET /api/admin/orders/bulk` - Get all bulk orders
- `PATCH /api/admin/orders/bulk/:orderId/status` - Update bulk order status

#### Admin Stats
- `GET /api/admin/stats/dashboard` - Get dashboard statistics

## 💾 Database Models

### User
- Email (unique)
- Phone
- Password (hashed)
- Name
- Role (user/admin/super_admin)
- Credits
- Membership status
- Timestamps

### Address
- User reference
- Label (Home/Work/Other)
- Full address
- Flat, Floor, Landmark
- Coordinates (latitude, longitude)
- Timestamps

### MenuBrand
- Name (unique)
- Description
- Image URL
- Active status

### MenuCategory
- Brand reference
- Name
- Description
- Active status
- Compound index: (brandId, name)

### MenuItem
- Brand reference
- Category reference
- Name
- Description
- Price
- Membership price
- Image URL
- Veg/Non-veg
- Rating
- Bestseller flag
- Active status

### Order
- User reference
- Brand reference
- Items (with quantity, price)
- Address reference
- Status (PLACED/PREPARING/OUT_FOR_DELIVERY/DELIVERED/CANCELLED)
- Payment method
- Amounts (subtotal, tax, delivery, discount, total)
- Coupon code
- Delivery slot
- Timestamps

### BulkOrder
- Name, Phone, Email
- People count
- Event date/time
- Address
- Brand preference
- Budget per head
- Status
- Assigned admin
- Timestamps

### Offer
- Code (unique, uppercase)
- Title & description
- Type (FLAT_OFF/PERCENTAGE/FREE_DELIVERY)
- Value
- Validity dates
- Usage limits
- Category

### Membership
- Name (Free/Premium)
- Duration (months)
- Price
- Discount percentage
- Benefits list
- Active status

## 📊 Seeding Data

### Seed Menu Data

```bash
npm run seed
```

Creates sample brands with categories and menu items:
- BOX8 - Desi Meals
- LeanCrust Pizza
- Behrouz Biryani
- The Good Bowl

### Seed Admin Users

```bash
npm run seed:admin
```

Creates admin and super_admin users with credentials from `.env`

## 📝 Middleware

### Authentication Middleware
Validates JWT tokens and attaches user info to requests.

```javascript
app.use(authMiddleware); // Require valid JWT
```

### Admin Middleware
Checks if authenticated user has admin role.

```javascript
app.use(adminMiddleware); // Require admin role (after auth)
```

### Validation Middleware
Validates request body using Joi schemas.

```javascript
validateRequest(schema) // Validate and transform body
```

### Error Handler
Global error handling middleware catching all exceptions.

## 🧪 Testing

Use Postman or similar tool to test endpoints.

**Example: Register User**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**Example: Create Order**
```bash
POST http://localhost:5000/api/orders
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "items": [
    {
      "menuItemId": "63d2a1b2c3d4e5f6g7h8i9j0",
      "quantity": 2
    }
  ],
  "addressId": "63d2a1b2c3d4e5f6g7h8i9j1",
  "paymentMethod": "UPI",
  "deliverySlot": "2024-12-25 10:00 AM"
}
```

## 🔧 Development

### Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files (db, logger)
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # Route definitions
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Helper functions & validators
│   ├── constants/        # App constants
│   ├── seed/             # Data seeding scripts
│   └── server.js         # Entry point
├── .env.example
├── .gitignore
└── package.json
```

### Adding New Features

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Add validators in `src/utils/validators/`
5. Mount routes in `server.js`

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Joi Validation](https://joi.dev/)

## ⚠️ Important Notes

1. **Change JWT_SECRET in production**
2. **Use strong passwords in production**
3. **Enable CORS only for your frontend domain**
4. **Use MongoDB Atlas connection string in production**
5. **Set NODE_ENV=production in production**

## 📞 Support

For issues or questions, please reach out to the team.
