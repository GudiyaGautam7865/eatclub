# Login & Signup Implementation

## Overview
This implementation replaces the separate admin login UI with a unified Login/Signup flow that provides a consistent frontend experience.

## Features Implemented

### Login Page (`/login`)
- **Email/Password Form**: Standard login with email and password fields
- **Google Sign-in Button**: UI-only Google sign-in option (no backend integration)
- **Role-based Redirect**: 
  - If `user.role === "ADMIN"` → redirects to `/admin/dashboard`
  - Otherwise → redirects to `/`
  - Fallback: `admin@gmail.com` + password `1260` → admin dashboard (dev compatibility)
- **Error Handling**: Displays friendly error messages for invalid credentials
- **Loading States**: Disables form during submission with loading indicator

### Signup Page (`/signup`)
- **Complete Registration Form**: 
  - Name (required)
  - Email (required) 
  - Phone Number (optional, accepts various formats)
  - Password (required, min 6 characters)
  - Confirm Password (required, must match)
- **Client-side Validation**: Real-time validation with inline error messages
- **Success Redirect**: After successful signup, redirects to `/`

### Header Integration
- **Login Button**: Header now shows "Login" button that navigates to `/login`
- **User Profile**: When logged in, shows user avatar and name with dropdown menu
- **Sign Out**: Proper logout functionality that clears localStorage and redirects

## How to Test

### Opening Login UI
1. Click the "Login" button in the header (top-right)
2. This navigates to `/login` page
3. Or directly visit `http://localhost:3000/login`

### Testing Login
**Regular User Login:**
- Use any email/password combination
- On success: redirects to home page (`/`)

**Admin Login:**
- Email: `admin@gmail.com`
- Password: `1260`  
- On success: redirects to `/admin/dashboard`

**Backend Integration:**
- Login calls `authService.login({ email, password })`
- Expects response: `{ token, user }` where `user.role` determines redirect
- If `user.role === "ADMIN"` → admin dashboard
- Otherwise → home page

### Testing Signup
1. From login page, click "Register" link
2. Or directly visit `http://localhost:3000/signup`
3. Fill out the form (name, email, password required; phone optional)
4. On success: redirects to home page with user logged in

### Navigation Between Pages
- **Login → Signup**: Click "Register" link on login page
- **Signup → Login**: Click "Login" link in signup page header
- **Back to Home**: Click logo on either page

## Data Storage

### localStorage Keys
- **Token**: `ec_user_token`
- **User Data**: `ec_user` (JSON stringified user object)

### User Context
- User state is managed via `UserContext`
- Automatically loads user from localStorage on app start
- Updates when user logs in/out

## API Integration

### Login Endpoint
```javascript
// Calls: POST /auth/login
// Payload: { email, password }
// Expected Response: { token, user }
```

### Signup Endpoint  
```javascript
// Calls: POST /auth/register  
// Payload: { name, email, password, phoneNumber }
// Expected Response: { token, user }
```

## Files Modified/Created

### New Files
- `client/src/pages/Login/LoginPage.jsx`
- `client/src/pages/Login/LoginPage.css`
- `client/src/pages/Login/SignupPage.jsx`
- `client/src/pages/Login/SignupPage.css`

### Modified Files
- `client/src/components/layout/Header/Header.jsx` - Removed modal, added login link
- `client/src/components/layout/Header/Header.css` - Updated login button styles
- `client/src/services/authService.js` - Updated localStorage keys and register endpoint
- `client/src/context/UserContext.jsx` - Added localStorage initialization
- `client/src/routes/AppRoutes.jsx` - Added login/signup routes

## Security Notes
- Admin access is determined by backend `user.role` field
- Fallback admin credentials (`admin@gmail.com`/`1260`) are for dev compatibility only
- No admin accounts are created through signup - admin status comes from backend
- All authentication tokens are stored in localStorage with `ec_` prefix

## Styling
- Consistent with existing EatClub design system
- Responsive design for mobile/tablet
- Smooth transitions and hover effects
- Error states with appropriate visual feedback