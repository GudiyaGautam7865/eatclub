

## Quick Setup (5 minutes)

### 1️⃣ Install Dependencies
```bash
cd server
npm install
```

### 2️⃣ Create Environment File
```bash
cp .env.example .env
```

### 3️⃣ Edit `.env` with Your Config
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eatclub
JWT_SECRET=your_secret_key_here
ADMIN_PASSWORD=your_admin_password
CORS_ORIGIN=http://localhost:5173
```

### 4️⃣ Start Development Server
```bash
npm run dev
```

Output:
```
✓ MongoDB Connected: localhost:27017
✓ Server running on port 5000
✓ Environment: development
```

### 5️⃣ Seed Sample Data (Optional)
```bash
# Terminal 1: Keep server running
# Terminal 2: Run seed scripts
npm run seed        # Creates menu items
npm run seed:admin  # Creates admin users
```

## 📌 Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with auto-reload |
| `npm start` | Start production server |
| `npm run seed` | Populate menu database |
| `npm run seed:admin` | Create admin users |

## ✅ Verify Setup

### Health Check
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{ "status": "Server is running" }
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_admin_password"
  }'
```

## 🔗 Frontend Integration

Update `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

In your client code:
```javascript
const API_URL = import.meta.env.VITE_API_BASE_URL;

// Example: Login
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

## 📊 MongoDB Connection

### Local MongoDB
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### MongoDB Atlas
Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eatclub
```

## 📚 API Base URL

**Development:** `http://localhost:5000/api`

All routes start with `/api`:
- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/menu/*` - Menu & items
- `/api/orders/*` - Orders
- `/api/admin/*` - Admin panel

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
✗ MongoDB Connection Error: connect ECONNREFUSED
```
**Solution:** Start MongoDB service or check MONGODB_URI in `.env`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in `.env` or kill process using port 5000

### CORS Error from Client
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Update CORS_ORIGIN in `.env` to match your frontend URL

### JWT Token Invalid
```
Invalid or expired token
```
**Solution:** Use the token from login response and include in Authorization header:
```
Authorization: Bearer <token>
```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/           # DB & logger config
│   ├── constants/        # App-wide constants
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth, validation, error
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── utils/            # Helpers & validators
│   ├── seed/             # Data seeding
│   └── server.js         # Main entry point
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
└── README.md             # Full documentation
```

## 🔑 Default Credentials

After running `npm run seed:admin`:

**Admin:**
- Username: `admin`
- Password: (from your `.env` ADMIN_PASSWORD)
- Email: `admin@eatclub.com`

## 📖 Next Steps

1. ✅ Backend server running
2. Frontend setup (already in place)
3. Connect frontend to backend API
4. Test user flows (signup, login, orders)
5. Test admin panel (menu management, orders)

## 📞 Common Questions

**Q: How do I add a new API endpoint?**
1. Create controller function in `src/controllers/`
2. Create/update route in `src/routes/`
3. Mount route in `src/server.js`

**Q: How do I modify database schema?**
1. Edit model in `src/models/`
2. No migration needed (Mongoose auto-adapts)
3. Reseed data if structure changes significantly

**Q: How do I switch to MongoDB Atlas?**
Update `.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eatclub
```

---

**🎉 You're all set! Happy coding!**
