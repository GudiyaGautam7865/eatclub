# Email Authentication Testing Guide

## Setup Required

### 1. Update .env file with email credentials:
```
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### 2. Gmail App Password Setup:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Use this app password in EMAIL_PASS

## API Endpoints

### 1. User Registration (with email verification)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

### 2. Verify Email
```bash
curl -X GET "http://localhost:5000/api/auth/verify-email?token=YOUR_TOKEN"
```

### 3. User Login (requires verified email)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### 4. Forgot Password (sends OTP)
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 5. Reset Password (with OTP)
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","newPassword":"newpass123"}'
```

### 6. Resend Verification Email
```bash
curl -X POST http://localhost:5000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## PowerShell Commands

### User Registration:
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Forgot Password:
```powershell
$body = @{
    email = "test@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/forgot-password" -Method POST -Body $body -ContentType "application/json"
```

### Reset Password:
```powershell
$body = @{
    email = "test@example.com"
    otp = "123456"
    newPassword = "newpass123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/reset-password" -Method POST -Body $body -ContentType "application/json"
```

## Flow:
1. Register → Email sent with verification link
2. Click verification link → Email verified
3. Login → Success (only if email verified)
4. Forgot password → OTP sent to email
5. Reset password with OTP → Password changed