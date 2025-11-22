# Fix "User Already Exists" Error

## Problem

Getting "User already exists" error when trying to register a new user, even with different business name and credentials.

## Likely Causes

1. **Username already taken** - Someone already registered with that username
2. **Case sensitivity** - Username might exist with different capitalization
3. **Database has existing test data** - Previous testing left user records

## Solution 1: Check Existing Users in Database

### Access the Database

1. **Azure Portal** → App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Advanced Tools (Kudu)** → **Go**
3. **Debug console** → **CMD**
4. Navigate: `cd site/wwwroot/data`
5. View database: `cat db.json`

### Check Users Section

Look for the `"users"` array in the JSON:
```json
{
  "users": [
    {
      "id": 1,
      "username": "ladudarko",
      "password_hash": "...",
      "business_name": "BigSix AutoSales LLC"
    },
    {
      "id": 2,
      "username": "leo",
      "password_hash": "...",
      "business_name": "Another Business"
    }
  ]
}
```

**Check if your desired username is already in the list.**

## Solution 2: Try Different Username

If the username exists, try:
- Different username (e.g., `leo2024`, `bigsixtruck`, `autoleo`)
- Add numbers or business identifier
- Use business name as username (e.g., `bigsixauto`)

## Solution 3: Remove Existing User (if it's yours)

If you see a user that's yours from previous testing:

### Option A: Edit in Kudu Console
1. In Kudu console: `cd site/wwwroot/data`
2. Click on `db.json` in file browser
3. Click **Edit** button
4. Remove the user object from the `users` array
5. **Important**: Keep valid JSON format
6. Click **Save**

### Option B: Reset Database (removes ALL data)
1. In Kudu console: `cd site/wwwroot/data`
2. Reset database: `echo '{"users": [], "expenses": []}' > db.json`
3. This removes **all users and expenses**

## Solution 4: Login with Existing Account

If you already have an account:
1. Try logging in instead of registering
2. Use the existing username and password
3. Check the database to see what username exists

## Common Usernames to Check

Based on your previous usage, check if these exist:
- `ladudarko`
- `leo`
- `bigsix`
- `bigsixtruck`

## Troubleshooting Steps

### Step 1: Identify the Issue
1. Check what username you're trying to register
2. Access database via Kudu console
3. Look at existing usernames in the `users` array

### Step 2: Choose Solution
- **If username is taken**: Try different username
- **If it's your old account**: Login instead of register
- **If it's test data**: Remove the user from database

### Step 3: Test Registration
1. Try registering with a unique username
2. Check browser console for detailed error messages
3. Verify registration succeeds

## Database Backup (Recommended)

Before making changes:
1. **Download** `db.json` from Kudu console
2. Save as backup: `db-backup-YYYY-MM-DD.json`
3. Make changes
4. If something breaks, upload the backup

## Example: Safe Username Changes

If database shows:
```json
"users": [
  {"username": "ladudarko", ...},
  {"username": "leo", ...}
]
```

Try registering with:
- `leo2024`
- `bigsixowner`
- `autotracker`
- `bigsixtruck`

## Check Registration Endpoint

The error comes from this code check:
```javascript
// Check if user exists
const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
if (existingUser.rows.length > 0) {
  return res.status(400).json({ error: 'User already exists' });
}
```

So the username must be **exactly unique** in the database.

---

## Quick Fix Steps

1. **Check database** via Kudu console (`site/wwwroot/data/db.json`)
2. **See what usernames exist** in the `users` array
3. **Try different username** for registration
4. **Or login** with existing account if it's yours

What username are you trying to register with? I can help you check if it conflicts with existing data.
