# Admin Profile Editing System - Implementation Complete

## Overview
Full-stack admin profile management with email verification for critical changes and backend JWT authentication.

## Backend Implementation

### 1. Environment Configuration (.env)
```
ADMIN_VERIFICATION_EMAIL=vivekjangam73@gmail.com
EMAIL_USER=omkarjagtap368@gmail.com
EMAIL_PASS=rekg pear eshi rlhu
```

### 2. Database Model (User.js)
Added fields for profile editing:
- `pendingEmail` - stores new email until verified
- `emailChangeCode` - 6-digit verification code
- `emailChangeExpires` - code expiration timestamp
- `avatar` - profile image URL

### 3. API Endpoints (/api/admin/profile/*)
All routes require authentication + admin role:

- **GET /me** - Get admin profile
- **PUT /me** - Update profile (name, phone, avatar)
- **POST /request-email-change** - Request email change (sends code to vivekjangam73@gmail.com)
- **POST /confirm-email-change** - Confirm email change with 6-digit code
- **POST /change-password** - Change password (requires current password)

### 4. Admin Authentication (/api/admin/auth/login)
- Real database authentication using bcrypt
- Issues JWT tokens
- Validates against User model with role='ADMIN'
- Credentials: email=admin@eatclub.com, password=12601260

### 5. Email Service
- `sendAdminEmailVerification(code)` - Sends 6-digit code to admin verification email
- Uses nodemailer with Gmail SMTP

## Frontend Implementation

### 1. Admin Auth Service (adminAuthService.js)
- Switched from hardcoded credentials to backend API
- Stores `ec_admin_token` and `ec_user` on login
- Clears all admin data on logout

### 2. Admin Profile Service (adminProfileService.js)
New service with methods:
- `getAdminProfile()` - Fetch current admin data
- `updateAdminProfile(data)` - Update name, phone, avatar
- `requestEmailChange(newEmail)` - Initiate email change flow
- `confirmEmailChange(code)` - Verify and complete email change
- `changePassword(current, new)` - Change password

### 3. Admin Profile Page (AdminProfilePage.jsx)
Enhanced with full edit capabilities:

**Edit Profile Mode:**
- Toggle edit mode with Edit button
- Form fields for name, phone, avatar URL
- Save changes with instant UI update

**Change Password Modal:**
- Current password verification
- New password with confirmation
- Auto-logout after successful change

**Change Email Modal:**
- Two-step process:
  1. Enter new email → sends code to vivekjangam73@gmail.com
  2. Enter 6-digit code → updates email
- Code expires in 10 minutes

**Features:**
- Loads real profile data from backend
- Syncs updates to localStorage and context
- Toast notifications for all actions
- Dynamic avatar with initials fallback
- Responsive modals with smooth animations

### 4. Admin Login Page (AdminLoginPage.jsx)
- Updated to use async backend login
- Shows loading state
- Handles error messages from API

### 5. Admin Topbar (AdminTopbar.jsx)
- Dynamic profile display from context/localStorage
- Shows actual admin name, role, and avatar
- Initials fallback when no avatar

## Seed Script

**Location:** `server/scripts/seedAdmin.js`

**Usage:**
```bash
cd server
node scripts/seedAdmin.js
```

Creates/updates admin user with credentials from .env:
- Email: admin@eatclub.com
- Password: 12601260

## Security Features

1. **JWT Authentication** - All admin routes require valid token
2. **Role-based Access** - Admin middleware enforces role='ADMIN'
3. **Password Hashing** - bcrypt with 10 salt rounds
4. **Email Verification** - Critical changes require 6-digit code
5. **Code Expiration** - Verification codes expire in 10 minutes
6. **Current Password Check** - Password changes require current password
7. **Session Invalidation** - Auto-logout after password change

## Verification Email Flow

1. Admin clicks "Change Email" in settings
2. Enters new email address
3. System sends 6-digit code to `vivekjangam73@gmail.com`
4. Admin checks email and enters code
5. Code verified → email updated
6. Admin can now login with new email

## Testing

### Admin Login
- URL: http://localhost:5173/admin/login
- Email: admin@eatclub.com
- Password: 12601260

### Edit Profile
1. Go to Admin Dashboard → Profile
2. Click "Edit" button in Account Information
3. Update name, phone, or avatar
4. Click "Save Changes"

### Change Password
1. Go to Settings tab
2. Click "Change Password"
3. Enter current password: 12601260
4. Enter new password (min 6 chars)
5. Confirm new password
6. Click "Change Password"
7. Auto-logout → login with new password

### Change Email
1. Go to Settings tab
2. Click "Change Email"
3. Enter new email
4. Click "Send Code"
5. Check vivekjangam73@gmail.com for code
6. Enter 6-digit code
7. Click "Verify & Change"
8. Logout → login with new email

## Next Steps (Optional Enhancements)

1. **Avatar Upload** - Integrate Cloudinary for direct image uploads
2. **2FA** - Add TOTP-based two-factor authentication
3. **Audit Log** - Track all profile changes with timestamps
4. **Session Management** - View and revoke active sessions
5. **Email Templates** - Rich HTML email templates with branding
6. **Rate Limiting** - Prevent brute force on code verification
7. **SMS Verification** - Alternative to email for critical changes
8. **Profile Picture Crop** - Client-side image cropping before upload

## Files Modified/Created

### Backend
- ✓ `.env` - Added ADMIN_VERIFICATION_EMAIL
- ✓ `src/models/User.js` - Added profile update fields
- ✓ `src/utils/emailService.js` - Added sendAdminEmailVerification
- ✓ `src/controllers/admin/adminAuthController.js` - Real DB authentication
- ✓ `src/controllers/admin/adminProfileController.js` - NEW (profile CRUD)
- ✓ `src/routes/admin/adminProfileRoutes.js` - NEW (profile routes)
- ✓ `src/server.js` - Registered profile routes
- ✓ `scripts/seedAdmin.js` - NEW (admin creation script)

### Frontend
- ✓ `src/services/adminAuthService.js` - Backend login integration
- ✓ `src/services/adminProfileService.js` - NEW (profile API client)
- ✓ `src/pages/Admin/Auth/AdminLoginPage.jsx` - Async login
- ✓ `src/pages/Admin/Profile/AdminProfilePage.jsx` - Full edit functionality
- ✓ `src/pages/Admin/Profile/AdminProfilePage.css` - Modal & form styles
- ✓ `src/components/admin/layout/AdminTopbar.jsx` - Dynamic profile display
- ✓ `src/components/admin/layout/AdminTopbar.css` - Avatar fallback fix

## Success Criteria ✅

- [x] Admin can login with email/password stored in database
- [x] Admin can edit name, phone, avatar from profile page
- [x] Admin can change email with verification code sent to vivekjangam73@gmail.com
- [x] Admin can change password with current password verification
- [x] Updated credentials work for subsequent logins
- [x] All changes persist to database
- [x] UI updates immediately across topbar and profile page
- [x] Verification codes expire after 10 minutes
- [x] Auto-logout after password change for security
- [x] Toast notifications for all actions
- [x] Responsive modals with smooth UX
