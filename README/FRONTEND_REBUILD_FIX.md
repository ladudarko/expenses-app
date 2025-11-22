# Frontend Still Using Localhost - Fix

## Problem

The frontend is still calling `http://localhost:3000/api/auth/register` instead of the Azure backend URL.

## Why This Happens

**Vite environment variables are embedded at BUILD TIME**, not runtime. This means:
- Even though `VITE_API_URL` is set in Azure Static Web Apps configuration
- The frontend was built BEFORE the variable was set
- So it still has the default localhost URL hardcoded

## Solution: Trigger Frontend Rebuild

I've triggered a rebuild by pushing an empty commit. The frontend will now rebuild with the correct `VITE_API_URL`.

### Wait for Deployment

1. **Check GitHub Actions**:
   - Go to: `https://github.com/ladudarko/expenses-app/actions`
   - Look for "Azure Static Web Apps CI/CD" workflow
   - Wait for it to complete (green checkmark)

2. **Wait 2-3 minutes** after deployment completes

3. **Clear Browser Cache**:
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or hard refresh the page
   - Or clear browser cache

### Verify It's Fixed

1. **Open Developer Tools** (F12)
2. **Go to Network tab**
3. **Try to register/login again**
4. **Check the request URL**:
   - ✅ Should be: `https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/api/auth/register`
   - ❌ Should NOT be: `http://localhost:3000/api/auth/register`

## Alternative: Manual Redeploy

If the automatic rebuild doesn't work:

1. **Azure Portal** → Static Web App: `expenses-app`
2. **Deployment Center**
3. Click **"Redeploy"** or **"Sync"**
4. Wait for deployment to complete

## After Rebuild

Once the frontend is rebuilt:
- Network requests should go to the Azure backend
- Login/signup should work
- The app should be fully functional!

---

**Current Status:**
- ✅ Backend configured correctly
- ✅ Frontend environment variable set
- ⏳ Frontend rebuild in progress (triggered)
- ⏳ Waiting for deployment to complete

