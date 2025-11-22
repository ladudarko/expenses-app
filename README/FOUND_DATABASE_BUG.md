# FOUND THE BUG! Database Query Parameter Issue

## Root Cause Identified

The issue is in the database query simulation code. The backend uses PostgreSQL-style parameters (`$1`, `$2`) but the database simulation was only looking for SQLite-style parameters (`?`).

## The Bug

In `server/src/config/database.ts`, the SELECT query parsing was:

```javascript
// OLD CODE - only matched ? parameters
const colMatch = condition.match(/(\w+)\s*=\s*\?/);
```

But the auth route uses PostgreSQL parameters:
```javascript
// This query uses $1 parameter
const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
```

## The Fix

Updated the regex to handle both parameter styles:

```javascript
// NEW CODE - matches both ? and $1, $2, etc.
const colMatch = condition.match(/(\w+)\s*=\s*(\?|\$\d+)/);
```

## What Was Happening

1. **Registration attempt**: `SELECT id FROM users WHERE username = $1` with `['test123']`
2. **Parameter parsing failed**: Regex didn't match `$1`, so no filtering occurred
3. **Query returned all users**: Instead of filtering by username, it returned the entire users array
4. **"User already exists"**: Since the array wasn't empty (contains `ladudarko`), it thought the user existed

## Result

- ✅ **Fixed the parameter parsing** to handle PostgreSQL-style parameters
- ✅ **Deployed the fix** to Azure via GitHub Actions
- ✅ **Registration should now work** with any new username

## Testing

After the deployment completes (2-3 minutes):

1. **Try registering** with `test123` again
2. **Should succeed** and return JWT token
3. **User should be added** to the database
4. **Login should work** with the new credentials

## Why This Wasn't Caught Earlier

- **Local development** might have worked differently
- **The bug was subtle** - queries appeared to work but returned wrong results
- **Database simulation** is complex and this edge case wasn't tested

---

## Status

- ✅ **Bug identified and fixed**
- ✅ **Code deployed to Azure**
- ⏳ **Waiting for deployment** (GitHub Actions in progress)
- ⏳ **Test registration after deployment**

The "User already exists" error should be resolved once the deployment completes!
