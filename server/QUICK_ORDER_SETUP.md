# Quick Order Creation for Load Testing

## Step 1: Login to Get Token

### Option A: Login as Regular User (if you have one)
```powershell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"password123"}'

$token = $loginResponse.data.token
$userId = $loginResponse.data.user.id
Write-Host "Token: $token"
Write-Host "User ID: $userId"
```

### Option B: Login as Admin (for testing)
```powershell
$adminResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@gmail.com","password":"1260"}'

$adminToken = $adminResponse.data.token
Write-Host "Admin Token: $adminToken"
```

### Option C: Create Test User First (if needed)
```powershell
# Register new test user
$registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Test User","email":"loadtest@test.com","password":"test123456","phoneNumber":"9999999999"}'

$token = $registerResponse.data.token
$userId = $registerResponse.data.user.id
Write-Host "New User Token: $token"
Write-Host "New User ID: $userId"

# Manually verify email (dev endpoint)
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/test-verify" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"loadtest@test.com"}'
```

## Step 2: Create Order

```powershell
# Make sure you have $token and $userId from Step 1

$orderBody = @{
  items = @(
    @{
      menuItemId = "test_item_1"
      name = "Test Biryani"
      qty = 2
      price = 299
    },
    @{
      menuItemId = "test_item_2"
      name = "Test Paneer"
      qty = 1
      price = 199
    }
  )
  total = 797
  payment = @{
    method = "COD"
  }
  address = @{
    line1 = "123 Test Street, Test Area"
    city = "Bangalore"
    pincode = "560001"
  }
  user = $userId
} | ConvertTo-Json -Depth 10

$orderResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{Authorization = "Bearer $token"} `
  -Body $orderBody

$orderId = $orderResponse.data._id
Write-Host "✅ Order Created!"
Write-Host "Order ID: $orderId"
Write-Host ""
Write-Host "📋 Copy this for your load test:"
Write-Host "`$env:ORDER_ID = `"$orderId`""
```

## Step 3: Run Load Test

```powershell
# Use the ORDER_ID from above
$env:ORDER_ID = "$orderId"  # This gets set automatically if you ran Step 2
$env:TOKEN = $token         # Optional: if endpoint requires auth
$env:DURATION_SEC = "120"
$env:SOCKET_RATE_HZ = "10"
$env:HTTP_RATE_HZ = "5"

npm run test:performance
```

---

## Complete One-Liner Script

Copy-paste this entire block:

```powershell
# Create user, login, create order, run test - all in one!

try {
  # Login as admin (or create your own user above)
  $adminResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"admin@gmail.com","password":"1260"}'
  
  $token = $adminResponse.data.token
  $userId = "admin"
  Write-Host "✓ Logged in successfully" -ForegroundColor Green
  
  # Create test order
  $orderBody = @{
    items = @(
      @{ menuItemId = "test_1"; name = "Test Biryani"; qty = 2; price = 299 }
      @{ menuItemId = "test_2"; name = "Test Paneer"; qty = 1; price = 199 }
    )
    total = 797
    payment = @{ method = "COD" }
    address = @{
      line1 = "123 Test Street, Test Area"
      city = "Bangalore"
      pincode = "560001"
    }
    user = $userId
  } | ConvertTo-Json -Depth 10
  
  $orderResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{Authorization = "Bearer $token"} `
    -Body $orderBody
  
  $orderId = $orderResponse.data._id
  Write-Host "✓ Order created: $orderId" -ForegroundColor Green
  Write-Host ""
  
  # Set env and run test
  $env:ORDER_ID = $orderId
  $env:TOKEN = $token
  $env:DURATION_SEC = "120"
  $env:SOCKET_RATE_HZ = "10"
  $env:HTTP_RATE_HZ = "5"
  
  Write-Host "🚀 Starting load test..." -ForegroundColor Cyan
  npm run test:performance
  
} catch {
  Write-Host "❌ Error: $_" -ForegroundColor Red
  Write-Host "Response: $($_.Exception.Response | ConvertTo-Json)" -ForegroundColor Yellow
}
```

---

## Troubleshooting

### Error: "User already exists"
Use Option B (admin login) or change email in Option C

### Error: "Authentication required"
The order endpoint needs auth. Make sure server is running without auth middleware disabled.

### Error: "Order not found" during load test
The ORDER_ID might be invalid. Check the response from Step 2.

### Quick Test - Just Get Any Existing Order
```powershell
# Get existing orders from your database
$adminResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/auth/login" `
  -Method POST -ContentType "application/json" `
  -Body '{"email":"admin@gmail.com","password":"1260"}'

$orders = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/orders/single" `
  -Headers @{Authorization = "Bearer $($adminResponse.data.token)"}

$firstOrder = $orders.data[0]._id
Write-Host "Using existing order: $firstOrder"
$env:ORDER_ID = $firstOrder
```
