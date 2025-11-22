# Update Username from ladudarko to leo

## ✅ Local Database Updated

I've updated the local database file (`server/data/db.json`) to change the username from `ladudarko` to `leo`.

**Updated user:**
- **Old username**: `ladudarko`
- **New username**: `leo`
- **Password**: Still `Summer12!`
- **Admin status**: Still `true` (admin user)
- **Business**: Still "BigSix AutoSales LLC"

## Local Testing

The backend has been restarted with the updated database. You can now:

1. **Login with new username**: `leo`
2. **Password**: `Summer12!`
3. **Should see**: Admin dashboard

## Azure Database Update

To update the username in Azure (production), you'll need to:

### Method 1: Via Kudu Console (Recommended)

1. **Azure Portal** → App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Advanced Tools (Kudu)** → **Go**
3. **Debug console** → **CMD**
4. Navigate: `cd site/wwwroot/data`
5. **Edit `db.json`**:
   - Click on `db.json` in file browser
   - Click **Edit** button
   - Find user with `"username": "ladudarko"`
   - Change to `"username": "leo"`
   - **Save** the file
6. **Restart App Service** (Azure Portal → Overview → Restart)
7. Wait 2-3 minutes for restart

### Method 2: Backup Current Database First

Before making changes, **always backup**:

```bash
# In Kudu console
cd site/wwwroot/data
cp db.json db-backup-$(date +%Y%m%d).json
# Then edit db.json
```

## Important Notes

⚠️ **The password hash remains the same** - this means:
- Password is still: `Summer12!`
- No need to change password
- All existing sessions may need to re-login

⚠️ **Update Frontend if needed**:
- If you have any hardcoded references to "ladudarko" in the frontend, update those
- Browser localStorage may have old tokens - clear and re-login

## Verification

After updating in Azure:

1. **Test login** with new username: `leo`
2. **Verify admin dashboard** still works
3. **Check all features** still function correctly

---

## Current Status

- ✅ **Local database**: Updated to `leo`
- ✅ **Backend restarted**: Ready for local testing
- ⏳ **Azure database**: Needs manual update (see Method 1 above)

**You can now login locally with username `leo` and password `Summer12!`**
