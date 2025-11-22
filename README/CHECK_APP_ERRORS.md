# Backend App Error - 503 Service Unavailable

## Status
❌ **Backend is deployed but NOT starting correctly**
- HTTP Status: **503 Service Unavailable**
- Error: Application Error page displayed

## Next Steps - Check Azure Logs

### Step 1: Check Azure Log Stream

1. **Azure Portal** → Your App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. Click **Log stream** in the left menu
3. Look for error messages like:
   - "Cannot find module"
   - "Error: listen EADDRINUSE"
   - "ENOENT: no such file or directory"
   - Database connection errors
   - Path errors

**Share the last 50 lines of logs** so we can see what's failing.

### Step 2: Common Issues & Fixes

#### Issue 1: Missing Environment Variables

**Check:**
- Azure Portal → Configuration → Application settings
- Make sure these are set:
  - `PORT` = `3000`
  - `NODE_ENV` = `production`
  - `JWT_SECRET` = (must have a value)
  - `FRONTEND_URL` = `https://icy-mud-054593f0f.3.azurestaticapps.net`

#### Issue 2: Startup Command Not Set

**Check:**
- Configuration (preview) → Stack settings → Startup Command
- Must be: `npm run start`

#### Issue 3: App Not Restarted After Config Changes

**Fix:**
- Overview → Click **Restart** button
- Wait 1-2 minutes
- Check health endpoint again

#### Issue 4: Missing Dependencies or Files

**Check Log Stream for:**
- "Cannot find module 'xxx'"
- "ENOENT: no such file or directory"
- "dist/index.js" not found

#### Issue 5: Database Path Error

**Check Log Stream for:**
- Database path errors
- File permission errors

The workflow should have created `data/db.json`, but verify it exists in deployment.

### Step 3: Check Deployment Files

1. **Azure Portal** → App Service → **Advanced Tools (Kudu)** → Go
2. **Debug console** → **CMD**
3. Navigate to `site/wwwroot`
4. Check structure:
   ```
   site/wwwroot/
   ├── dist/
   │   └── index.js (should exist)
   ├── package.json (should exist)
   ├── node_modules/ (should exist)
   └── data/
       └── db.json (should exist)
   ```

### Step 4: Enable Detailed Logging

1. **Azure Portal** → App Service → **Logs**
2. **Application Logging (Filesystem)** → Enable
3. **Level**: Verbose
4. Click **Save**
5. **Overview** → Restart
6. Check **Log stream** again

---

## Quick Diagnostic Checklist

- [ ] Startup command is `npm run start`
- [ ] `PORT` environment variable set (or uses default)
- [ ] `NODE_ENV` = `production`
- [ ] `JWT_SECRET` is set (not empty)
- [ ] `FRONTEND_URL` is set correctly
- [ ] App Service restarted after config changes
- [ ] Checked Log stream for errors
- [ ] Verified deployment files exist (dist/, package.json, node_modules/, data/)
- [ ] Application Logging enabled

---

## Share for Help

Please share:
1. **Last 50 lines from Log stream** (the actual error)
2. **Startup Command** from Configuration
3. **Environment variables** (names only, not values)
4. **Deployment file structure** (from Kudu console)

This will help identify the exact issue.

