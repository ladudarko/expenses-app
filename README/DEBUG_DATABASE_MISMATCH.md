# Debug: User Not in Database But "Already Exists" Error

## Problem

- Database (`db.json`) doesn't contain `test123`
- Backend returns "User already exists" for `test123`
- This suggests a disconnect between the database file and what the backend is reading

## Possible Causes

### 1. Database File Location Issue
The backend might be reading from a different database file than the one you're viewing.

### 2. Caching Issue
The backend might have cached an old version of the database in memory.

### 3. Database Query Bug
There might be a bug in the user lookup query.

### 4. File Permissions Issue
The backend might not be able to read/write the correct database file.

## Debugging Steps

### Step 1: Restart App Service (Clear Cache)

1. **Azure Portal** → App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Overview** → **Restart**
3. Wait 2-3 minutes for full restart
4. Try registering `test123` again

### Step 2: Check Database File Location

In Kudu console:
```bash
cd site/wwwroot
find . -name "db.json" -type f
# Should show: ./data/db.json
```

### Step 3: Check Database File Permissions

```bash
cd site/wwwroot/data
ls -la db.json
# Should show read/write permissions
```

### Step 4: Verify Database Content Format

```bash
cd site/wwwroot/data
cat db.json | head -20
# Check if JSON is properly formatted
```

### Step 5: Check Backend Logs

1. **Azure Portal** → App Service → **Log stream**
2. Try registering `test123` again
3. Look for error messages or database connection issues

### Step 6: Test Database Write

Try adding a test expense through the app to see if database writes work correctly.

## Quick Fixes to Try

### Fix 1: Restart App Service
This clears any cached database state.

### Fix 2: Force Database Refresh
In Kudu console:
```bash
cd site/wwwroot/data
# Backup current database
cp db.json db-backup.json

# Add a small change to force refresh
echo '{"users": [], "expenses": []}' > db.json
# Wait 30 seconds
# Restore original
cp db-backup.json db.json
```

### Fix 3: Check Database Path in Code

The backend looks for database at:
```
server/dist/config/../../data/db.json
```

Which should resolve to:
```
site/wwwroot/data/db.json
```

### Fix 4: Manual Database Reset

If nothing else works, reset the database:
```bash
cd site/wwwroot/data
echo '{"users": [], "expenses": []}' > db.json
```

## Test After Each Fix

After trying each fix:
1. Wait 1-2 minutes
2. Try registering with `test123`
3. Check if error persists

## Expected Behavior

If database is empty or doesn't contain `test123`:
- Registration should succeed
- New user should be added to database
- You should get success response with JWT token

## Debug Information to Gather

### 1. Current Database Contents
```bash
cd site/wwwroot/data
wc -l db.json  # Line count
cat db.json | grep -c "username"  # User count
```

### 2. Backend Database Path
Check if backend is using correct path by looking at startup logs.

### 3. File System Check
```bash
cd site/wwwroot
ls -la data/
# Verify db.json exists and has correct permissions
```

## Most Likely Issue

**App Service caching**: The backend has an old version of the database cached in memory. Restarting should fix this.

---

## Immediate Action Plan

1. **Restart App Service** (most likely fix)
2. **Wait 2-3 minutes**
3. **Try registering `test123` again**
4. **If still fails**: Check backend logs for error messages
5. **If logs show database errors**: Reset database file

Try the restart first - that's the most common cause of this type of issue.
