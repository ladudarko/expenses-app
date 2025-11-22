# Troubleshooting Login Issue

## Problem
Can't sign in using account "leo" on Static Web Apps.

## Likely Causes

### 1. ✅ Backend API URL Not Configured
The frontend defaults to `http://localhost:3000/api` if `VITE_API_URL` isn't set.

### 2. ✅ Backend Not Deployed/Running
Azure App Service might not be running or deployed.

### 3. ✅ CORS Configuration Issue
Backend might not allow requests from Static Web Apps URL.

---

## Quick Fix Steps

### Step 1: Check Browser Console
1. Open your Static Web Apps site
2. Press F12 (or Cmd+Option+I on Mac)
3. Go to **Console** tab
4. Try to log in
5. Look for errors like:
   - `Failed to fetch`
   - `Network error`
   - `CORS policy`
   - Any red error messages

### Step 2: Check Network Tab
1. Open **Network** tab in browser dev tools
2. Try to log in
3. Look for the login request (should be to `/api/auth/login`)
4. Check:
   - What URL is it trying to connect to?
   - Is it getting a response?
   - What's the status code?

### Step 3: Verify Backend is Running
Visit your backend health endpoint:
```
https://your-backend-app-service.azurewebsites.net/health
```

Should return: `{"status":"ok","message":"BigSix AutoSales API is running"}`

If this doesn't work, your backend isn't deployed or running.

---

## Solution

### Option A: Backend Not Deployed Yet

If you haven't deployed the backend:

1. **Deploy Backend First:**
   - See `DEPLOYMENT.md` or `HYBRID_DEPLOYMENT_SETUP.md`
   - Make sure Azure App Service is running
   - Verify health endpoint works

### Option B: Set Environment Variable

If backend is deployed, configure the frontend:

1. **Go to Azure Portal:**
   - Navigate to your **Static Web App**
   - Go to **Configuration** → **Application settings**

2. **Add Environment Variable:**
   - Click **+ Add**
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-app-service.azurewebsites.net/api`
   - Replace `your-backend-app-service` with your actual App Service name
   - Click **OK** → **Save**

3. **Important: Redeploy Frontend**
   Since Vite embeds environment variables at build time, you must redeploy:

   **Option 1 - Azure Portal:**
   - Static Web App → **Overview** → Click **"Redeploy"** button

   **Option 2 - GitHub:**
   ```bash
   git commit --allow-empty -m "Redeploy frontend with API URL"
   git push origin main
   ```

### Option C: Configure CORS on Backend

If backend is deployed but CORS is blocking:

1. **Go to Azure Portal:**
   - Navigate to your **App Service**
   - Go to **Configuration** → **Application settings**

2. **Set FRONTEND_URL:**
   - **Name**: `FRONTEND_URL`
   - **Value**: Your Static Web Apps URL (e.g., `https://icy-mud-054593f0f.azurestaticapps.net`)
   - Click **OK** → **Save**

3. **Restart App Service:**
   - Go to **Overview** → Click **Restart**

---

## Debugging Steps

### Check What API URL Frontend is Using

Add this temporarily to check what URL the frontend is using:

1. Open browser console on your Static Web Apps site
2. Run:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000/api');
   ```

This will show what URL the frontend is trying to use.

### Check Backend Logs

1. Azure Portal → Your App Service
2. Go to **Log stream** or **Logs**
3. Try to log in
4. Check for any errors in the logs

### Test Backend Directly

Try to register/login directly via curl or Postman:

```bash
# Replace with your backend URL
curl -X POST https://your-backend-app-service.azurewebsites.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"leo","password":"your-password"}'
```

If this works, the backend is fine and it's a frontend configuration issue.

---

## Common Error Messages

### "Failed to fetch" or "Network error"
- Backend not deployed or not running
- `VITE_API_URL` not set correctly
- Backend URL is incorrect

### "Invalid credentials"
- Username/password incorrect
- User doesn't exist (try registering first)
- Password hash mismatch

### "CORS policy" error
- `FRONTEND_URL` not set in backend
- Backend CORS not configured correctly
- Static Web Apps URL not matching `FRONTEND_URL`

### "User already exists" when trying to register
- User "leo" already exists
- Try logging in instead
- Or use a different username

---

## Next Steps

1. ✅ Check browser console for errors
2. ✅ Verify backend health endpoint works
3. ✅ Set `VITE_API_URL` in Static Web Apps
4. ✅ Set `FRONTEND_URL` in App Service
5. ✅ Redeploy frontend after setting env vars
6. ✅ Test login again

If you still have issues, share:
- Browser console errors
- Network tab request/response
- Backend health endpoint response

