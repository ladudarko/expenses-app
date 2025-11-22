# URGENT: Database Mismatch Issue

## Problem Confirmed

- Database file (`db.json`) is empty or doesn't contain test users
- Backend returns "User already exists" for ANY username
- Even completely new usernames like `verynewuser999` fail
- This indicates a serious database connection issue

## Root Cause

The backend is likely:
1. **Reading from wrong database file location**
2. **Has cached old database state in memory**
3. **Database query logic has a bug**

## Immediate Fix: Restart App Service

This is the most likely fix for cached database state:

1. **Azure Portal** → App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Overview** → **Restart** button
3. **Wait 3-5 minutes** for full restart
4. **Try registering again**

## If Restart Doesn't Work

### Check Database File Location

In Kudu console:
```bash
cd site/wwwroot
find . -name "*.json" -type f
# Should show ./data/db.json
```

### Verify Database Path in Backend

The backend expects database at:
```
site/wwwroot/data/db.json
```

### Force Database Refresh

1. **Kudu console**: `cd site/wwwroot/data`
2. **Backup**: `cp db.json db-backup.json`
3. **Reset**: `echo '{"users": [], "expenses": []}' > db.json`
4. **Test registration** (should work now)
5. **If needed, restore**: `cp db-backup.json db.json`

## Debug the Database Query

The issue might be in the database query logic. Looking at the code:

```javascript
// This query checks if user exists
const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
```

The simulated database might have a bug in the SELECT query parsing.

## Quick Test Commands

### Test 1: Check Database Contents
```bash
cd site/wwwroot/data
cat db.json
wc -l db.json
```

### Test 2: Check File Permissions
```bash
ls -la db.json
# Should show read/write permissions
```

### Test 3: Validate JSON Format
```bash
cat db.json | python -m json.tool
# Should format JSON or show error
```

## Nuclear Option: Reset Everything

If nothing else works:

1. **Kudu console**: `cd site/wwwroot/data`
2. **Complete reset**: `echo '{"users": [], "expenses": []}' > db.json`
3. **Restart App Service**
4. **Wait 3 minutes**
5. **Try registration**

## Expected Result After Fix

After fixing, registration should:
- ✅ Accept new usernames
- ✅ Add user to database
- ✅ Return success with JWT token
- ✅ Allow login with new credentials

---

## Action Plan (Do This Now)

1. **Restart App Service** (Azure Portal → Overview → Restart)
2. **Wait 3-5 minutes**
3. **Try registering with `test123` again**
4. **If still fails**: Reset database file in Kudu console
5. **Test again**

The restart should fix the caching issue. If not, the database file needs to be reset.

**This is definitely a backend caching/database connection issue, not a user conflict.**
