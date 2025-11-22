# How to Access the Database on Azure

## Current Database Setup

Your app uses a **JSON file-based database** located at:
```
server/data/db.json
```

When deployed to Azure App Service, this file is stored at:
```
/home/site/wwwroot/data/db.json
```

## Methods to Access the Database

### Method 1: Azure Portal - Kudu Console (Recommended)

1. **Azure Portal** → Your App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. Click **Advanced Tools (Kudu)** → **Go**
3. Click **Debug console** → **CMD**
4. Navigate to the data directory:
   ```bash
   cd site/wwwroot
   cd data
   ls -la
   ```
5. **View the database file**:
   ```bash
   cat db.json
   ```
6. **Edit the database file**:
   - Click on `db.json` in the file browser
   - Click **Edit** button
   - Make your changes
   - Click **Save**

### Method 2: Azure Portal - SSH Terminal

1. **Azure Portal** → Your App Service
2. Click **SSH** (or **Console** in some interfaces)
3. Navigate to database:
   ```bash
   cd /home/site/wwwroot/data
   cat db.json
   ```
4. **To edit**:
   ```bash
   nano db.json
   # or
   vi db.json
   ```
5. Save changes (Ctrl+X, then Y in nano, or :wq in vi)

### Method 3: Download via Kudu Console

1. **Azure Portal** → App Service → **Advanced Tools (Kudu)** → **Go**
2. **Debug console** → **CMD**
3. Navigate: `site/wwwroot/data`
4. Click **Download** button next to `db.json`
5. **Edit locally** in your text editor
6. **Upload** the modified file back:
   - Click **Upload** button
   - Select your modified `db.json`
   - Replace the existing file

### Method 4: Using Azure CLI (Command Line)

If you have Azure CLI installed:

```bash
# Login to Azure
az login

# Download the database file
az webapp remote-connection create \
  --resource-group <your-resource-group> \
  --name expenses-tracker-backend-b4cxc0etfnaabqb9 \
  --port 2222

# Use SCP to download
scp -P 2222 root@expenses-tracker-backend-b4cxc0etfnaabqb9.scm.azurewebsites.net:/home/site/wwwroot/data/db.json ./db.json

# Edit locally, then upload back
scp -P 2222 ./db.json root@expenses-tracker-backend-b4cxc0etfnaabqb9.scm.azurewebsites.net:/home/site/wwwroot/data/db.json
```

## Database Structure

Your database file (`db.json`) has this structure:

```json
{
  "users": [
    {
      "id": 1,
      "username": "leo",
      "password_hash": "...",
      "business_name": "BigSix AutoSales LLC",
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "expenses": [
    {
      "id": 1,
      "user_id": 1,
      "date": "2025-10-24",
      "category": "Vehicle Purchase",
      "description": "...",
      "vendor": "...",
      "amount": 23439.25,
      "expense_type": "Business",
      "project_name": "2023 Ford F150 Truck Repair",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

## Common Operations

### Backup the Database

1. **Kudu Console** → `site/wwwroot/data`
2. **Download** `db.json` to your local machine
3. Save with date: `db-backup-YYYY-MM-DD.json`

### Reset User Password

**Option 1: Via Kudu Console**
1. Open `db.json` in Kudu console
2. Find the user you want to reset
3. Generate new password hash (see below)
4. Replace `password_hash` value
5. Save file

**Option 2: Via API (Recommended)**
Use the registration API or implement a password reset endpoint.

### Generate Password Hash

To generate a password hash for manual database edits:

```bash
# Using Node.js (locally or in Kudu console)
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

Or create a simple script:
```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('your-password', 10).then(hash => {
  console.log('Password hash:', hash);
});
```

### Add Expense Manually

1. Edit `db.json` in Kudu console
2. Add new expense object to `expenses` array:
```json
{
  "id": <next-id>,
  "user_id": <user-id>,
  "date": "YYYY-MM-DD",
  "category": "Vehicle Maintenance",
  "description": "Oil change",
  "vendor": "Auto Shop",
  "amount": 50.00,
  "expense_type": "Business",
  "project_name": "Project Name",
  "created_at": "2025-11-20T...",
  "updated_at": "2025-11-20T..."
}
```

## Important Notes

⚠️ **Warning:**
- Always **backup** the database before making changes
- Changes to `db.json` are **persistent** in Azure App Service
- Invalid JSON will break the app - validate before saving
- The app will **restart** if you make changes (which is fine)

✅ **Best Practices:**
- Download and backup before editing
- Test changes locally first if possible
- Keep backups with timestamps
- Document what changes you make

## Alternative: Upgrade to PostgreSQL (Future)

For production use, consider upgrading to Azure Database for PostgreSQL:
- More robust and scalable
- Better backup options
- Supports concurrent access
- Transaction support

Current setup (JSON file) is fine for:
- Single user scenarios
- Small datasets
- Development/testing

See `server/src/config/schema.sql` for PostgreSQL schema when ready to upgrade.

---

## Quick Access Links

- **Kudu Console**: 
  - Go to: Azure Portal → App Service → **Advanced Tools (Kudu)** → **Go**
  - Then: **Debug console** → **CMD**
  - Navigate: `site/wwwroot/data`

- **Database File**: `/home/site/wwwroot/data/db.json`

