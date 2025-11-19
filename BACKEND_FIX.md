# Fix Backend Deployment Issues

## Current Issues

1. ✅ Backend App Service created: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. ❌ App not starting (health endpoint returns error)
3. ❌ Frontend API URL not configured

## Fix Steps

### Step 1: Update Workflow File (DONE)

The workflow file has been updated with the correct App Service name.

### Step 2: Configure Azure App Service

1. **Go to Azure Portal** → Your App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`

2. **Set Startup Command**:
   - Configuration (preview) → **Stack settings** tab
   - **Startup Command**: `npm run start`
   - Click **Save**

3. **Set Application Settings**:
   - Configuration → Application settings
   - Click **"New application setting"** for each:
   
   | Name | Value |
   |------|-------|
   | `PORT` | `3000` |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | (generate with: `openssl rand -hex 32`) |
   | `FRONTEND_URL` | `https://icy-mud-054593f0f.3.azurestaticapps.net` |
   
   Click **Save**

4. **Check Deployment**:
   - Deployment Center → Check if deployment succeeded
   - If failed, check logs

### Step 3: Check App Service Logs

1. **Azure Portal** → App Service → **Log stream**
2. Look for errors like:
   - "Cannot find module"
   - "Error starting server"
   - Port binding issues

### Step 4: Configure Frontend API URL

1. **Azure Portal** → Static Web App: `icy-mud-054593f0f`
2. **Configuration** → Environment variables
3. Click **"Add"**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/api`
   - Click **OK**
4. Click **Save**

5. **Redeploy Frontend**:
   - Push a new commit OR
   - Deployment Center → Redeploy

### Step 5: Verify

1. **Backend Health Check**:
   ```
   https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/health
   ```
   Should return: `{"status":"ok","message":"BigSix AutoSales API is running"}`

2. **Backend API Test**:
   ```
   https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/api/auth/me
   ```
   Should return an error (no auth), but NOT "Cannot GET"

3. **Frontend Login**:
   - Visit: `https://icy-mud-054593f0f.3.azurestaticapps.net`
   - Try to login/signup
   - Should work now!

## Common Issues

### Issue: "Cannot GET /health"
**Cause**: App not starting or wrong startup command

**Fix**:
1. Check Startup Command is `npm run start`
2. Check Log stream for errors
3. Verify `dist/index.js` exists in deployment

### Issue: "Cannot find module"
**Cause**: Dependencies not installed

**Fix**:
1. Check deployment logs
2. Verify `node_modules` is in deployment
3. Check package.json has correct dependencies

### Issue: Frontend still shows "Failed to fetch"
**Cause**: `VITE_API_URL` not set or not redeployed

**Fix**:
1. Verify environment variable in Static Web Apps
2. Trigger a redeploy
3. Check browser console Network tab to see what URL it's calling

### Issue: CORS errors
**Cause**: `FRONTEND_URL` not set correctly

**Fix**:
1. Set `FRONTEND_URL` = `https://icy-mud-054593f0f.3.azurestaticapps.net` (no trailing slash)
2. Restart App Service

## Quick Checklist

- [ ] Workflow file updated with correct App Service name
- [ ] Startup Command set to `npm run start`
- [ ] PORT = `3000` in App Service settings
- [ ] FRONTEND_URL = `https://icy-mud-054593f0f.3.azurestaticapps.net` (no trailing slash)
- [ ] JWT_SECRET set
- [ ] NODE_ENV = `production`
- [ ] VITE_API_URL set in Static Web Apps
- [ ] Frontend redeployed
- [ ] Backend health check works
- [ ] Login works

---

**Current Status**:
- ✅ Workflow updated
- ⏳ App Service configuration needed (Step 2)
- ⏳ Frontend API URL needed (Step 4)

