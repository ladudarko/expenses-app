# Fix JSON Syntax Error in Database

## Problem

You have a JSON syntax error in the database file at position 350, line 10. This happened when manually adding `"is_admin": true` to the database.

## Quick Fix

### Step 1: Access Database via Kudu Console

1. **Azure Portal** → App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Advanced Tools (Kudu)** → **Go**
3. **Debug console** → **CMD**
4. Navigate: `cd site/wwwroot/data`

### Step 2: Check Current Database

```bash
cat db.json
```

Look for the syntax error around line 10. Common issues:
- Missing comma after previous property
- Extra comma after `"is_admin": true`
- Missing quotes around property names
- Incorrect bracket/brace placement

### Step 3: Fix the JSON Format

The correct format should be:

```json
{
  "users": [
    {
      "id": 1,
      "username": "your-username",
      "password_hash": "$2b$10$...",
      "business_name": "BigSix AutoSales LLC",
      "is_admin": true,
      "created_at": "2025-10-30T17:00:21.600Z",
      "updated_at": "2025-10-30T17:00:21.600Z"
    }
  ],
  "expenses": [...]
}
```

**Key points:**
- ✅ Comma after `"business_name": "BigSix AutoSales LLC",`
- ✅ No comma after `"is_admin": true` if it's the last property before timestamps
- ✅ Comma after `"is_admin": true,` if there are more properties after it

### Step 4: Edit the File

**Option A: Edit in Kudu Console**
1. Click on `db.json` in the file browser
2. Click **Edit** button
3. Fix the JSON syntax error
4. **Validate JSON** before saving (copy to online JSON validator)
5. Click **Save**

**Option B: Replace with Corrected Version**

If the file is too corrupted, you can reset it. First backup:
```bash
cp db.json db-backup-broken.json
```

Then create a clean version:
```bash
cat > db.json << 'EOF'
{
  "users": [
    {
      "id": 1,
      "username": "ladudarko",
      "password_hash": "$2b$10$OvhVQ6skP2WHYGXahV29vuynIybtjLU6PpGyVvrXgcS82hgi/Kv6a",
      "business_name": "BigSix AutoSales LLC",
      "is_admin": true,
      "created_at": "2025-10-30T17:00:21.600Z",
      "updated_at": "2025-10-30T17:00:21.600Z"
    }
  ],
  "expenses": []
}
EOF
```

**Note:** This will remove all expenses. If you want to keep expenses, copy them from the backup first.

### Step 5: Restart App Service

After fixing the JSON:
1. **Azure Portal** → App Service → **Overview** → **Restart**
2. Wait 2-3 minutes for restart
3. Check health: `https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/health`

## Common JSON Syntax Errors

### Error 1: Missing Comma
```json
// WRONG
{
  "business_name": "BigSix AutoSales LLC"
  "is_admin": true
}

// CORRECT
{
  "business_name": "BigSix AutoSales LLC",
  "is_admin": true
}
```

### Error 2: Extra Comma
```json
// WRONG
{
  "is_admin": true,
}

// CORRECT
{
  "is_admin": true
}
```

### Error 3: Missing Quotes
```json
// WRONG
{
  is_admin: true
}

// CORRECT
{
  "is_admin": true
}
```

## Validate JSON Online

Before saving, copy your JSON to an online validator:
- https://jsonlint.com/
- https://jsonformatter.curiousconcept.com/

## Prevention

For future edits:
1. **Always backup** before editing: `cp db.json db-backup.json`
2. **Validate JSON** before saving
3. **Use proper JSON editor** or online tools
4. **Test after changes** by checking the health endpoint

---

## Quick Recovery Steps

1. **Access Kudu console** (`cd site/wwwroot/data`)
2. **Backup broken file**: `cp db.json db-broken.json`
3. **Fix JSON syntax** (edit or replace)
4. **Validate JSON** format
5. **Save file**
6. **Restart App Service**
7. **Test health endpoint**

The backend should start properly after fixing the JSON syntax error.
