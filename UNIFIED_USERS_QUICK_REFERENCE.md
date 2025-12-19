# Unified Users Collection - Quick Reference

## What Changed?

### Before
```
SEPARATE COLLECTIONS:
├── users (User documents)
└── deliveryboys (DeliveryBoy documents)
```

### After
```
SINGLE COLLECTION:
└── users (User, DELIVERY_BOY, ADMIN documents)
```

---

## Code Changes at a Glance

### 1. User Model
```javascript
// BEFORE: role: ['USER', 'ADMIN']
// AFTER: role: ['USER', 'ADMIN', 'DELIVERY_BOY']

// ADDED FIELDS:
- phone (required for DELIVERY_BOY)
- vehicleType (BIKE, SCOOTER, BICYCLE, CAR)
- vehicleNumber
- deliveryStatus (ACTIVE, INACTIVE, ON_DELIVERY, OFFLINE)
- earnings
- rating
```

### 2. Auth Controller - Login
```javascript
// BEFORE: 3-tier check (User → Admin → DeliveryBoy)
// AFTER: Single unified check

// New Flow:
const user = User.findOne({ email: normalizedEmail });
if (user) {
  // Check role-specific requirements
  // Return with user.role (can be USER, DELIVERY_BOY, or ADMIN)
}
```

### 3. Delivery Boy Controller
```javascript
// BEFORE: import DeliveryBoy from '../models/DeliveryBoy.js';
// AFTER: import User from '../models/User.js';

// All CRUD operations:
DeliveryBoy.create() → User.create({ role: 'DELIVERY_BOY' })
DeliveryBoy.find() → User.find({ role: 'DELIVERY_BOY' })
```

---

## Field Mapping

### Creating/Updating Delivery Boy in Users Collection
| Operation | Before | After |
|-----------|--------|-------|
| Create | `DeliveryBoy.create()` | `User.create({ role: 'DELIVERY_BOY' })` |
| Status field | `status` | `deliveryStatus` |
| Query | `DeliveryBoy.find()` | `User.find({ role: 'DELIVERY_BOY' })` |

---

## Login Response

### Before (Separate Collections)
```json
{
  "role": "DELIVERY_BOY",
  "user": {
    "id": "...",
    "phone": "...",
    "status": "ACTIVE"
  }
}
```

### After (Unified Collection)
```json
{
  "role": "DELIVERY_BOY",
  "user": {
    "id": "...",
    "phone": "...",
    "deliveryStatus": "ACTIVE"
  }
}
```

---

## Testing Quick Start

### 1. Create Delivery Boy
```bash
curl -X POST http://localhost:5000/api/delivery-boys/ \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Driver",
    "email": "john@example.com",
    "phone": "+919876543210",
    "vehicleType": "BIKE",
    "password": "Pass123"
  }'
```

### 2. Login as Delivery Boy
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Pass123"
  }'
```

### 3. Expected Result
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "role": "DELIVERY_BOY",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Driver",
      "email": "john@example.com",
      "phone": "+919876543210",
      "vehicleType": "BIKE",
      "deliveryStatus": "ACTIVE"
    }
  }
}
```

---

## Files Modified

✅ `server/src/models/User.js` - Added delivery boy fields
✅ `server/src/controllers/authController.js` - Unified login
✅ `server/src/controllers/deliveryBoyController.js` - Use User model

❌ **No Changes Needed**:
- Frontend (works as-is)
- Routes (endpoints unchanged)
- Email service (unchanged)

---

## Why This Is Better

1. **Simpler**: One collection instead of two
2. **Cleaner**: Unified login logic
3. **Faster**: No cross-collection queries
4. **Scalable**: Easy to add more roles (RESTAURANT, MANAGER, etc.)
5. **Consistent**: All user data in one place

---

## Migration (If Needed)

If you have existing DeliveryBoy records in separate collection:

```javascript
// 1. Read all DeliveryBoys
const deliveryBoys = await DeliveryBoy.find();

// 2. Transform and create in Users collection
for (const db of deliveryBoys) {
  await User.create({
    name: db.name,
    email: db.email.toLowerCase().trim(),
    phone: db.phone,
    password: db.password, // Already hashed
    role: 'DELIVERY_BOY',
    vehicleType: db.vehicleType,
    vehicleNumber: db.vehicleNumber,
    deliveryStatus: db.status, // Map status → deliveryStatus
    isActive: db.isActive,
    isEmailVerified: false,
  });
}

// 3. Delete old collection
await DeliveryBoy.deleteMany();
```

---

## Verification Checklist

- ✅ All files compile without errors
- ✅ Email normalization working (lowercase + trim)
- ✅ Password hashing/comparison working
- ✅ Role-based login working
- ✅ Frontend route redirection working
- ✅ API responses include role and role-specific data
- ✅ Backward compatibility maintained (hardcoded admin)

