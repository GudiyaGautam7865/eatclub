# Performance Testing & Analysis Guide

## Quick Start

### 1. Start the Server

```powershell
# Open terminal in server directory
cd C:\Users\vivek126\Projects\SmartMatrix\vivek\eatclub\server

# Set optimized environment variables
$env:TRACKING_PERSIST_INTERVAL_MS = "5000"
$env:TRACKING_MIN_LATLNG_DELTA = "0.00005"
$env:MONGO_MAX_POOL_SIZE = "50"
$env:RATE_LIMIT_MAX = "150"

# Start server
npm run dev
```

### 2. Get an Order ID

Create a test order first via your API or frontend, then copy the order ID.

**Quick test order creation (if you have auth setup):**
```powershell
# Create test order via API (adjust as needed)
# Or use an existing order ID from your database
```

### 3. Run Performance Test

```powershell
# In a NEW terminal (keep server running)
cd C:\Users\vivek126\Projects\SmartMatrix\vivek\eatclub\server

# Set test configuration
$env:BASE_URL = "http://localhost:5000"
$env:ORDER_ID = "YOUR_ORDER_ID_HERE"  # ⚠️ REPLACE THIS
$env:DURATION_SEC = "120"              # 2 minutes test
$env:SOCKET_RATE_HZ = "10"             # 10 socket events per second
$env:HTTP_RATE_HZ = "5"                # 5 HTTP requests per second

# Optional: Add auth token if your endpoint requires it
# $env:TOKEN = "your_bearer_token_here"

# Run test and analyze
npm run test:performance
```

**This will:**
1. ✅ Run load test for 2 minutes
2. ✅ Generate detailed report
3. ✅ Automatically analyze results
4. ✅ Tell you if the hanging issue is resolved

## Understanding the Results

### ✅ PASSED - Server is Stable
```
✅ STATUS: PASSED - Server is stable!
💡 The server hanging issue appears to be RESOLVED.
```
**Meaning:** No timeouts, stable latency, controlled memory growth. Your fixes worked!

### ✅ PASSED (with warnings)
```
✅ STATUS: PASSED (with warnings)
⚠️  Warnings: Memory growth detected: +45MB (+12%)
💡 The server is stable but could be optimized further.
```
**Meaning:** Server works but could be better. Not critical but monitor in production.

### ❌ FAILED - Issues Detected
```
❌ STATUS: FAILED - Issues detected!
❌ Critical issues:
   ❌ 15 requests timed out (>5s) - SERVER HANGING DETECTED
💡 The server hanging issue is NOT fully resolved.
```
**Meaning:** Server still hangs under load. Need more optimization.

## Test Scenarios

### Scenario 1: Light Load (Baseline)
```powershell
$env:DURATION_SEC = "60"
$env:SOCKET_RATE_HZ = "5"
$env:HTTP_RATE_HZ = "2"
npm run test:performance
```

### Scenario 2: Medium Load (Typical)
```powershell
$env:DURATION_SEC = "120"
$env:SOCKET_RATE_HZ = "10"
$env:HTTP_RATE_HZ = "5"
npm run test:performance
```

### Scenario 3: Heavy Load (Stress Test)
```powershell
$env:DURATION_SEC = "180"
$env:SOCKET_RATE_HZ = "20"
$env:HTTP_RATE_HZ = "10"
npm run test:performance
```

### Scenario 4: Long Duration (Memory Leak Detection)
```powershell
$env:DURATION_SEC = "600"  # 10 minutes
$env:SOCKET_RATE_HZ = "8"
$env:HTTP_RATE_HZ = "4"
npm run test:performance
```

## What the Analyzer Checks

### 1. **Request Timeouts** (Most Critical)
- ❌ FAIL: Any requests timeout after 5 seconds
- ✅ PASS: All requests complete within timeout
- **Why it matters:** Timeouts = server hanging (original problem)

### 2. **Latency Degradation**
- ❌ FAIL: P95 latency > 2000ms OR latency increases >50% during test
- ⚠️ WARN: P95 latency > 1000ms OR latency increases >20%
- ✅ PASS: Stable latency throughout test
- **Why it matters:** Increasing latency = performance degrading over time

### 3. **Memory Leaks**
- ❌ FAIL: Memory grows >50% AND >100MB
- ⚠️ WARN: Memory grows >30% AND >50MB
- ✅ PASS: Memory growth <50MB or <20%
- **Why it matters:** Memory leaks cause eventual crashes

### 4. **Socket Stability**
- ❌ FAIL: >2 unexpected disconnects
- ⚠️ WARN: Any socket errors
- ✅ PASS: Stable connection
- **Why it matters:** Disconnects = tracking system unstable

## Manual Commands

### Run Only Load Test
```powershell
npm run loadtest:report
```

### Analyze Existing Report
```powershell
npm run analyze-report
```

### View Raw Report
```powershell
Get-Content .\load-test-report.json | ConvertFrom-Json | Format-List
```

## Monitoring During Test

### Watch Server Logs
Look for:
- ⏱️ "Slow request" warnings (>500ms)
- ⚠️ "Tracking write slow" warnings
- 🧠 Memory logs (if enabled)

### Check Metrics Endpoint
```powershell
# In another terminal while test is running
Invoke-WebRequest http://localhost:5000/api/metrics | Select-Object -Expand Content
```

## Troubleshooting

### "ORDER_ID env is required"
```powershell
# You forgot to set ORDER_ID
$env:ORDER_ID = "674848a6aa76dc66e01b1833"  # Use your actual order ID
```

### "Report not found"
```powershell
# Run the load test first
npm run loadtest:report
```

### Connection Refused
```powershell
# Make sure server is running in another terminal
# Check: http://localhost:5000/health
```

### All Requests Fail
```powershell
# Check if endpoint requires auth
$env:TOKEN = "your_bearer_token"
# Run test again
```

## Interpreting Metrics

### Good Performance Indicators
- ✅ Success rate: >95%
- ✅ P95 latency: <1000ms
- ✅ Memory growth: <50MB over 2 min test
- ✅ No timeouts
- ✅ No socket disconnects

### Bad Performance Indicators
- ❌ Success rate: <90%
- ❌ P95 latency: >2000ms
- ❌ Latency increasing over time
- ❌ Memory growing continuously
- ❌ Any request timeouts

## Next Steps After Testing

### If Test PASSES ✅
1. Run longer duration test (10-30 min)
2. Test with multiple concurrent clients
3. Deploy to staging and monitor
4. Set up production monitoring

### If Test FAILS ❌
1. Check server logs for specific errors
2. Review analyzer recommendations
3. Adjust environment variables:
   - Increase `TRACKING_PERSIST_INTERVAL_MS` (try 10000)
   - Increase `MONGO_MAX_POOL_SIZE` (try 100)
4. Re-run test after changes

## Environment Variables Reference

### Server Configuration
```powershell
$env:TRACKING_PERSIST_INTERVAL_MS = "5000"    # How often to save location (ms)
$env:TRACKING_MIN_LATLNG_DELTA = "0.00005"    # Min movement to save (degrees)
$env:MONGO_MAX_POOL_SIZE = "50"                # MongoDB connection pool
$env:RATE_LIMIT_MAX = "150"                    # Rate limit per window
$env:SOCKET_MAX_ROOMS = "5"                    # Max rooms per socket
```

### Load Test Configuration
```powershell
$env:BASE_URL = "http://localhost:5000"        # Server URL
$env:ORDER_ID = "..."                          # Test order ID
$env:DURATION_SEC = "120"                      # Test duration
$env:SOCKET_RATE_HZ = "10"                     # Socket events/sec
$env:HTTP_RATE_HZ = "5"                        # HTTP requests/sec
$env:METRICS_INTERVAL_SEC = "10"               # How often to collect metrics
$env:TOKEN = "..."                             # Optional auth token
```

## Example: Full Test Session

```powershell
# Terminal 1: Start server
cd C:\Users\vivek126\Projects\SmartMatrix\vivek\eatclub\server
$env:TRACKING_PERSIST_INTERVAL_MS = "5000"
npm run dev

# Terminal 2: Run test (after creating/getting order ID)
cd C:\Users\vivek126\Projects\SmartMatrix\vivek\eatclub\server
$env:ORDER_ID = "674848a6aa76dc66e01b1833"
$env:DURATION_SEC = "120"
npm run test:performance

# Wait 2 minutes...
# Analyzer automatically runs and shows verdict!
```

---

**Remember:** The goal is to verify the server doesn't hang under tracking load. A PASSED verdict means your optimization fixes worked! 🎉
