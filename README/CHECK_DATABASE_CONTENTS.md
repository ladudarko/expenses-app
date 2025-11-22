# Check Database Contents - User Already Exists

## Confirmed Issue

The backend is returning "User already exists" for username `test123`, which means this username is actually in the database.

## Check Database Contents

### Step 1: Access Database via Kudu Console

1. **Azure Portal** → App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Advanced Tools (Kudu)** → **Go**
3. **Debug console** → **CMD**
4. Navigate to database: `cd site/wwwroot/data`
5. View database contents: `cat db.json`

### Step 2: Look for Username `test123`

In the JSON output, look for the `"users"` array and check if `test123` appears:

```json
{
  "users": [
    {
      "id": 1,
      "username": "ladudarko",
      ...
    },
    {
      "id": 2,
      "username": "test123",  ← Look for this
      ...
    }
  ]
}
```

## Solutions

### Option 1: Use Different Username

Try registering with a completely unique username:
- `uniqueuser2024`
- `bigsixowner`
- `autotracker999`
- `newuser` + current date

### Option 2: Remove Existing `test123` User

If you see `test123` in the database and it's your test account:

1. **In Kudu console**, click on `db.json` in the file browser
2. Click **Edit** button
3. **Find and remove** the user object with `"username": "test123"`
4. **Keep valid JSON format** (don't break commas/brackets)
5. Click **Save**

**Example removal:**
```json
// BEFORE
{
  "users": [
    {"id": 1, "username": "ladudarko", ...},
    {"id": 2, "username": "test123", ...},  ← Remove this entire object
    {"id": 3, "username": "other", ...}
  ]
}

// AFTER
{
  "users": [
    {"id": 1, "username": "ladudarko", ...},
    {"id": 3, "username": "other", ...}
  ]
}
```

### Option 3: Reset Entire Database (Nuclear Option)

If you want to start fresh:

1. **In Kudu console**: `cd site/wwwroot/data`
2. **Reset database**: `echo '{"users": [], "expenses": []}' > db.json`
3. **This removes ALL users and expenses**

## Quick Test Commands

### Check if specific usernames exist:
```bash
# In Kudu console
grep -i "test123" db.json
grep -i "ladudarko" db.json
```

### Count total users:
```bash
# In Kudu console
grep -c "username" db.json
```

## Recommended Action

1. **Check database contents** first (see what users exist)
2. **If `test123` exists**: Remove it or use different username
3. **Try registering again** with unique username

## Alternative Unique Usernames

Since `test123` is taken, try:
- `testuser2024`
- `bigsixtest`
- `demo123`
- `newaccount`
- `user` + today's date (e.g., `user1121`)

---

## What to do right now:

1. **Access Kudu console** (Azure Portal → App Service → Advanced Tools)
2. **Check `db.json`** contents (`cd site/wwwroot/data` then `cat db.json`)
3. **See if `test123` is listed** in the users array
4. **Either remove it or use different username**

The username `test123` definitely exists in your database - that's why you're getting the error.
