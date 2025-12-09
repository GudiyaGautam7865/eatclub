# EatClub - MERN Food Ordering Platform

Full-stack food ordering application built with MongoDB, Express.js, React, and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd eatclub
```

### 2. Setup Backend
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and other credentials

# Run database migration (one-time)
npm run migrate:test-to-eatclub

# Seed admin user
npm run seed:admin

# Start server
npm run dev
```

Server runs on: http://localhost:5000

### 3. Setup Frontend
```bash
cd client
npm install

# Start client
npm run dev
```

Client runs on: http://localhost:5173

---

## 📁 Project Structure

```
eatclub/
├── client/                 # React Frontend
│   ├── public/
│   │   └── data/          # Static JSON data (brands, menus)
│   └── src/
│       ├── assets/        # Images, fonts
│       ├── components/    # React components
│       │   ├── admin/    # Admin dashboard components
│       │   ├── cart/     # Cart & checkout components
│       │   ├── common/   # Shared components
│       │   ├── home/     # Homepage components
│       │   ├── menu/     # Menu browsing components
│       │   └── orders/   # Order management components
│       ├── context/       # React Context (Cart, User, UI)
│       ├── hooks/         # Custom React hooks
│       ├── layouts/       # Page layouts
│       ├── pages/         # Page components
│       ├── routes/        # Route definitions
│       ├── services/      # API service layer
│       ├── styles/        # CSS files
│       └── utils/         # Helper functions
│
└── server/                # Express Backend
    ├── src/
    │   ├── config/       # Database connection
    │   ├── controllers/  # Route controllers
    │   │   └── admin/   # Admin controllers
    │   ├── middleware/   # Auth, error handling
    │   ├── models/       # Mongoose models
    │   ├── routes/       # API routes
    │   │   └── admin/   # Admin routes
    │   ├── seed/         # Database seeders
    │   └── utils/        # Helper functions
    └── API_TESTING.md    # Complete API testing guide
```

---

## 🔑 Key Features

### User Features
- User registration & authentication (JWT)
- Browse restaurants and menus
- Add items to cart
- Place orders with address
- View order history
- Bulk order requests for parties/events
- Membership benefits

### Admin Features
- Admin authentication
- View all orders (single & bulk)
- Update order status
- Manage menu items (create, list, filter)
- Dashboard with statistics

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Routing
- **Context API** - State management
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## 📚 Documentation

- **API Testing Guide**: `server/API_TESTING.md` - Complete guide for testing all endpoints
- **Environment Setup**: `server/.env.example` - Example environment variables

---

## 🗄️ Database Schema

### Collections in `eatclub` database:

#### users
- name, email, password (hashed)
- role: USER | ADMIN
- isActive, isEmailVerified
- timestamps

#### orders
- user (ref to users)
- items[] (menuItemId, name, qty, price)
- total, status (PLACED/PREPARING/DELIVERED/CANCELLED)
- payment (method, txId)
- address (line1, city, pincode)
- timestamps

#### bulkorders
- name, phone, peopleCount
- eventDateTime, address
- brandPreference, budgetPerHead
- status (PENDING/CONFIRMED/DELIVERED/CANCELLED)
- timestamps

#### menuitems
- brandId, brandName
- categoryId, categoryName
- name, description
- price, membershipPrice
- isVeg, imageUrl, isAvailable
- timestamps

---

## 🔐 Default Admin Credentials

After running `npm run seed:admin`:

```
Email: admin@eatclub.com
Password: Admin@123
```

**⚠️ Change these credentials in production!**

---

## 🧪 Testing APIs

See complete testing guide: `server/API_TESTING.md`

Quick test:
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Pass@123\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Pass@123\"}"
```

---

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Render, Railway, or AWS
- Set environment variables in hosting platform
- Ensure MongoDB URI is set correctly

### Frontend (React)
- Deploy to Vercel, Netlify, or AWS S3
- Update API base URL in `src/services/apiClient.js`
- Build: `npm run build`

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

Developed by the EatClub development team.
