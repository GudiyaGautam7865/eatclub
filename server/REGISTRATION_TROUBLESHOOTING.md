# Registration Error Troubleshooting

## Problem
Getting `{"success":false,"message":"Server error during registration"}` when trying to register

## Root Causes & Solutions

### 1. **Missing Email Configuration** (Most Common)
**Issue:** `EMAIL_USER` and `EMAIL_PASS` environment variables not set in `.env`

**Fix:** Add to `server/.env`:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to App Passwords (bottom of page)
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Use it as `EMAIL_PASS`

### 2. **MongoDB Connection Issue**
**Issue:** Database not connected or wrong database

**Fix:** Check in `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/eatclub
```

**Verify:**
- MongoDB is running locally OR
- Connection string points to correct remote DB
- Database name is `eatclub` (not `test`)

### 3. **Invalid Input Data**
**Issue:** Required fields missing or invalid

**Valid Registration Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "phoneNumber": "9876543210"
  }'
```

**Required fields:**
- `name` (string, non-empty)
- `email` (string, valid email format)
- `password` (string, minimum 6 characters)
- `phoneNumber` (string, optional, 10 digits if provided)

### 4. **User Already Exists**
**Issue:** Email already registered

**Expected Response:** `409 Conflict`
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**Fix:** Use a different email address

### 5. **Server Logs**
**Enable Debug Logging:** Restart server and check console output

**What to look for:**
```
Registration error: [error details]
Full error: [stack trace]
```

---

## Quick Diagnostic Steps

### Step 1: Check .env Configuration
```bash
cd server
cat .env | grep -E "(EMAIL_|MONGODB_|JWT_)"
```

### Step 2: Test Email Service
```bash
node -e "
import('nodemailer').then(m => {
  const transporter = m.default.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  transporter.verify((err, success) => {
    if (err) console.error('Email error:', err);
    else console.log('Email config OK:', success);
  });
}).catch(e => console.error(e));
"
```

### Step 3: Test MongoDB Connection
```bash
node -e "
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('✓ MongoDB connected');
  console.log('Database:', mongoose.connection.name);
  process.exit(0);
}).catch(e => console.error('✗ MongoDB error:', e.message));
"
```

### Step 4: Test Registration Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "TestPassword123",
    "phoneNumber": "9876543210"
  }' | jq .
```

---

## Updated Behavior

The registration endpoint has been updated to:
- ✅ Log detailed error messages in development
- ✅ Continue registration even if email verification fails
- ✅ Return user + token immediately (for dev convenience)
- ⚠️ Warn about email sending failures

**New Response (on success):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "9876543210",
      "role": "USER",
      "isEmailVerified": false
    }
  }
}
```

---

## Testing Without Email

### Option 1: Skip Email Service
If you don't want to setup Gmail, you can use the test endpoint to manually verify:

```bash
# 1. Register user (email will fail silently)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123","phoneNumber":"9876543210"}'

# 2. Manually verify email
curl -X POST http://localhost:5000/api/auth/test-verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# 3. Now login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'
```

### Option 2: Auto-Verify on Registration (Dev Only)
Modify `registerUser` to auto-verify in development:
```javascript
if (process.env.NODE_ENV === 'development') {
  user.isEmailVerified = true;
  await user.save();
}
```

---

## Still Having Issues?

1. **Enable Node debug:**
   ```bash
   NODE_DEBUG=* npm start
   ```

2. **Check server startup:**
   ```bash
   npm start 2>&1 | head -20
   ```

3. **Verify all dependencies installed:**
   ```bash
   cd server && npm ls nodemailer bcryptjs mongoose
   ```

4. **Clear and reinstall:**
   ```bash
   cd server && rm -rf node_modules package-lock.json && npm install
   ```

