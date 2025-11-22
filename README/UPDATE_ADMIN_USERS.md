# Update Admin Users Configuration

## Changes Made

### 1. Created New Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Business Name**: "System Administrator"
- **Role**: Admin (`is_admin: true`)
- **Access**: Admin dashboard only

### 2. Removed Admin from Leo User
- **Username**: `leo`
- **Role**: Regular user (`is_admin: false`)
- **Access**: Regular expense tracker view only
- **Business**: "BigSix AutoSales LLC"

## User Access Summary

### Admin User
- **Login**: `admin` / `admin123`
- **Sees**: Purple admin dashboard with system-wide analytics
- **Can do**: View all businesses, users, expenses across system
- **Cannot do**: Access regular expense tracker for individual business

### Regular User (Leo)
- **Login**: `leo` / `Summer12!`
- **Sees**: Blue expense tracker for "BigSix AutoSales LLC"
- **Can do**: Manage expenses for their own business
- **Cannot do**: Access admin dashboard or view other businesses' data

## Testing Locally

### Test Admin User
1. **Open**: `http://localhost:5173`
2. **Login**: 
   - Username: `admin`
   - Password: `admin123`
3. **Expected**: Purple admin dashboard

### Test Regular User
1. **Logout** from admin
2. **Login**:
   - Username: `leo`
   - Password: `Summer12!`
3. **Expected**: Blue expense tracker (regular view)

## Update Azure Database

To apply these changes to production, update the Azure database:

### Step 1: Access Database
1. **Azure Portal** → App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Advanced Tools (Kudu)** → **Go**
3. **Debug console** → **CMD**
4. Navigate: `cd site/wwwroot/data`

### Step 2: Backup First
```bash
cp db.json db-backup-$(date +%Y%m%d-%H%M%S).json
```

### Step 3: Update Database
Edit `db.json`:

1. **Find leo user** and change:
   ```json
   "is_admin": false,  // Change from true to false
   ```

2. **Add new admin user** after leo user:
   ```json
   {
     "id": 2,  // Use next available ID
     "username": "admin",
     "password_hash": "$2b$10$wY0TiVaDdZ4J5m4YXUEQ0uMXSKGgrlHwIxH6GJ7bCUwq9y5DVwM.q",
     "business_name": "System Administrator",
     "is_admin": true,
     "created_at": "2025-11-21T16:30:00.000Z",
     "updated_at": "2025-11-21T16:30:00.000Z"
   }
   ```

### Step 4: Save and Restart
1. **Save** the `db.json` file
2. **Restart App Service** (Azure Portal → Overview → Restart)
3. Wait 2-3 minutes

### Step 5: Verify
1. **Login as admin**: `admin` / `admin123` → Should see admin dashboard
2. **Login as leo**: `leo` / `Summer12!` → Should see regular expense tracker

## Security Notes

⚠️ **Important**: 
- The admin password `admin123` is **weak** for production
- Consider changing it after initial setup
- Admin user should have a strong password in production

## Current Database Structure

```json
{
  "users": [
    {
      "id": 1,
      "username": "leo",
      "is_admin": false,  ← Regular user
      ...
    },
    {
      "id": 2,
      "username": "admin",
      "is_admin": true,  ← Admin user
      ...
    }
  ]
}
```

## Summary

✅ **Local database updated**
✅ **Backend restarted**
✅ **Ready for testing**

- **Admin user**: `admin` / `admin123` → Admin dashboard
- **Regular user**: `leo` / `Summer12!` → Expense tracker
