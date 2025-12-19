# Delivery Boy System - Testing Guide

## 🚀 Quick Start Testing

### Prerequisites
- MongoDB running
- Server running on port 5000
- Client running on port 5173
- Email configured in `.env` (optional for testing)

---

## Test 1: Admin Creates Delivery Boy

### Steps:
1. **Login as Admin**
   ```
   URL: http://localhost:5173
   Email: admin@gmail.com
   Password: 1260
   ```

2. **Navigate to Delivery Boys**
   ```
   Click: Admin → Delivery Boys
   Or go to: http://localhost:5173/admin/delivery-boys
   ```

3. **Add New Delivery Boy**
   - Click "Add New Delivery Boy" button
   - Fill the form:
     ```
     Name: Test Rider
     Phone: +91 9876543210
     Email: testrider@example.com
     Vehicle Type: BIKE
     Vehicle Number: MH12AB1234
     ```
   - Click "Add Delivery Boy"

4. **Expected Results:**
   - Success message appears
   - Alert shows temporary password
   - Email sent to testrider@example.com (if email configured)
   - Delivery boy appears in list

5. **Check Backend**
   ```bash
   # Using MongoDB Compass or mongo shell
   use eatclub
   db.deliveryboys.find()
   ```

### Expected API Response:
```json
{
  "success": true,
  "message": "Delivery boy created successfully. Credentials sent via email.",
  "data": {
    "deliveryBoy": {
      "id": "...",
      "name": "Test Rider",
      "email": "testrider@example.com",
      "phone": "+91 9876543210",
      "vehicleType": "BIKE",
      "vehicleNumber": "MH12AB1234",
      "status": "ACTIVE",
      "role": "DELIVERY_BOY"
    },
    "temporaryPassword": "Ab12#xyz..."
  }
}
```

---

## Test 2: Delivery Boy Login

### Steps:
1. **Logout from Admin**
   - Click profile icon → Logout

2. **Login as Delivery Boy**
   ```
   Email: testrider@example.com
   Password: [Use password from admin alert or email]
   ```

3. **Expected Results:**
   - Login successful
   - Automatically redirected to: `/delivery/dashboard`
   - Dashboard shows:
     - Welcome message with delivery boy name
     - Stats cards (Total Deliveries, Today's Deliveries, Earnings, Rating)
     - Quick action buttons
     - Recent activity

4. **Verify localStorage**
   ```javascript
   // Open browser console
   JSON.parse(localStorage.getItem('ec_user'))
   // Should show:
   {
     "id": "...",
     "name": "Test Rider",
     "email": "testrider@example.com",
     "role": "DELIVERY_BOY",
     ...
   }
   ```

---

## Test 3: Delivery Boy Dashboard Navigation

### Test Dashboard:
1. **View Dashboard**
   ```
   URL: /delivery/dashboard
   Verify: Stats display correctly
   ```

### Test Orders Page:
1. **Navigate to Orders**
   - Click "View Orders" or go to `/delivery/orders`
   - Verify: Order list shows with filters
   - Test filters: All, New, In Progress, Completed

### Test Profile Page:
1. **Navigate to Profile**
   - Click "My Profile" or go to `/delivery/profile`
   - Verify: Personal information displayed
   - Test: Edit button (if enabled)

### Test Logout:
1. **Logout**
   - Click logout button
   - Verify: Redirected to homepage
   - Verify: localStorage cleared

---

## Test 4: Role-Based Login Redirection

### Test User Login:
1. **Login as regular user**
   ```
   Email: [any registered user]
   Password: [user password]
   ```
2. **Expected:** Redirect to `/` (homepage)

### Test Admin Login:
1. **Login as admin**
   ```
   Email: admin@gmail.com
   Password: 1260
   ```
2. **Expected:** Redirect to `/admin`

### Test Delivery Boy Login:
1. **Login as delivery boy**
   ```
   Email: testrider@example.com
   Password: [generated password]
   ```
2. **Expected:** Redirect to `/delivery/dashboard`

---

## Test 5: API Endpoints (Using Postman/Thunder Client)

### Create Delivery Boy (Admin):
```http
POST http://localhost:5000/api/delivery-boys
Headers:
  Content-Type: application/json
  Authorization: Bearer [admin_token]
Body:
{
  "name": "John Rider",
  "email": "john@example.com",
  "phone": "9876543210",
  "vehicleType": "BIKE",
  "vehicleNumber": "KA01AB1234"
}
```

### Get All Delivery Boys:
```http
GET http://localhost:5000/api/delivery-boys
Headers:
  Authorization: Bearer [admin_token]
```

### Get Single Delivery Boy:
```http
GET http://localhost:5000/api/delivery-boys/[deliveryBoyId]
Headers:
  Authorization: Bearer [admin_token]
```

### Update Status:
```http
PATCH http://localhost:5000/api/delivery-boys/[deliveryBoyId]/status
Headers:
  Content-Type: application/json
  Authorization: Bearer [admin_token]
Body:
{
  "status": "ACTIVE"
}
```

### Delete Delivery Boy:
```http
DELETE http://localhost:5000/api/delivery-boys/[deliveryBoyId]
Headers:
  Authorization: Bearer [admin_token]
```

### Login (Unified):
```http
POST http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json
Body:
{
  "email": "testrider@example.com",
  "password": "generatedPassword"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token...",
    "role": "DELIVERY_BOY",
    "user": {
      "id": "...",
      "name": "Test Rider",
      "email": "testrider@example.com",
      "role": "DELIVERY_BOY",
      ...
    }
  }
}
```

---

## Test 6: Email Verification

### Check Email Service:
1. **Configure .env**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:5173
   ```

2. **Create delivery boy**
   - Admin creates new delivery boy
   - Check inbox of delivery boy's email
   - Verify email contains:
     - Welcome message
     - Email address
     - Password
     - Login URL

### Email Format Example:
```
Subject: Welcome to EatClub - Delivery Partner Credentials

Welcome to EatClub, Test Rider!

You have been registered as a Delivery Partner. Please use the following credentials to login:

Email: testrider@example.com
Password: Ab12#xyz...

Login URL: http://localhost:5173

Please change your password after first login for security.
```

---

## Test 7: Error Handling

### Test Invalid Login:
```
Email: wrong@example.com
Password: wrongpassword
Expected: "Invalid email or password" error
```

### Test Inactive Delivery Boy:
1. Set delivery boy status to INACTIVE in database
2. Try to login
3. Expected: "Your account is inactive. Please contact admin." error

### Test Duplicate Email:
1. Try to create delivery boy with existing email
2. Expected: "Delivery boy with this email already exists" error

### Test Missing Required Fields:
1. Try to create delivery boy without name
2. Expected: "Name, email, and phone are required" error

---

## 🐛 Common Issues & Solutions

### Issue: Email not sending
**Solution:**
- Check EMAIL_USER and EMAIL_PASS in `.env`
- Verify Gmail App Password (not regular password)
- Check nodemailer transporter configuration
- Delivery boy still created, just email fails

### Issue: Delivery boy can't login
**Solution:**
- Verify delivery boy exists in database
- Check `isActive` field is true
- Verify password is correct (check alert from admin)
- Clear browser localStorage and try again

### Issue: Wrong redirect after login
**Solution:**
- Check login response contains `role` field
- Verify `ec_user` in localStorage has role
- Check LoginModal.jsx role-based routing logic

### Issue: 401 Unauthorized on API calls
**Solution:**
- Verify admin token is in Authorization header
- Check token format: `Bearer [token]`
- Verify token hasn't expired

---

## ✅ Checklist

Before deployment, verify:

- [ ] Admin can create delivery boys
- [ ] Emails are sent (or password shown in alert)
- [ ] Delivery boy can login with credentials
- [ ] Redirects to `/delivery/dashboard` correctly
- [ ] Dashboard displays data properly
- [ ] Orders page shows mock data
- [ ] Profile page loads
- [ ] Logout works and clears session
- [ ] Admin login still works
- [ ] User login still works
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Database has DeliveryBoy collection
- [ ] API endpoints return correct responses

---

## 📊 Test Results Template

```
Date: _________
Tester: _________

Test 1: Admin Creates Delivery Boy
  [ ] Pass  [ ] Fail
  Notes: ___________

Test 2: Delivery Boy Login
  [ ] Pass  [ ] Fail
  Notes: ___________

Test 3: Dashboard Navigation
  [ ] Pass  [ ] Fail
  Notes: ___________

Test 4: Role-Based Redirection
  [ ] Pass  [ ] Fail
  Notes: ___________

Test 5: API Endpoints
  [ ] Pass  [ ] Fail
  Notes: ___________

Test 6: Email Verification
  [ ] Pass  [ ] Fail
  Notes: ___________

Test 7: Error Handling
  [ ] Pass  [ ] Fail
  Notes: ___________
```

---

## 🎯 Success Criteria

All features working if:
1. ✅ Admin creates delivery boy successfully
2. ✅ Credentials sent/displayed
3. ✅ Delivery boy can login
4. ✅ Correct dashboard redirection
5. ✅ All pages accessible
6. ✅ No role mixing (admin/user/delivery boy)
7. ✅ Clean logout
8. ✅ No breaking changes to existing features

---

## 🚀 Ready for Production!
