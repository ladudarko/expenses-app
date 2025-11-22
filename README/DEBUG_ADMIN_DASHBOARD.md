# Debug Admin Dashboard Not Showing

## Problem

- Database shows `"is_admin": true` for ladudarko ✅
- Backend login returns `"is_admin": true` ✅  
- But admin dashboard is not showing when logged in

## Troubleshooting Steps

### Step 1: Clear Browser Cache and Storage

1. **Open Developer Tools** (F12)
2. **Application/Storage tab**
3. **Clear all**:
   - Local Storage (clear `auth_token`)
   - Session Storage
   - Cookies
4. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Step 2: Check Frontend Console

1. **Open Developer Tools** (F12)
2. **Console tab**
3. **Login again** and check for:
   - JavaScript errors
   - Network request failures
   - User object in console

### Step 3: Verify User Object in Frontend

After logging in, check in browser console:
```javascript
// Check what's stored in localStorage
console.log('Token:', localStorage.getItem('auth_token'));

// Check user object (if available in React DevTools)
// Look for user.is_admin in the App component state
```

### Step 4: Check Network Requests

1. **Developer Tools** → **Network tab**
2. **Login again**
3. **Check login response**:
   - Should show `"is_admin": true` in response
   - Verify token is being stored

### Step 5: Force Logout and Re-login

1. **Logout** from the app
2. **Clear browser storage** (Step 1)
3. **Login again** with ladudarko credentials
4. **Check if admin dashboard appears**

### Step 6: Check Frontend Build

The issue might be that the frontend was built before the admin features were added. 

**Check if frontend has latest code**:
- Admin dashboard should redirect automatically if `user?.is_admin` is true
- Look for purple admin interface instead of regular expense tracker

### Step 7: Manual Frontend Refresh

If the Static Web App hasn't rebuilt with the latest admin code:

1. **GitHub Actions**: Check if frontend deployment completed
2. **Force rebuild**: Push a small change to trigger rebuild
3. **Wait for deployment**: 2-3 minutes for Static Web Apps

## Expected Behavior

When `is_admin: true`:
1. **Login** → Backend returns user with `"is_admin": true`
2. **Frontend checks** `user?.is_admin` in App.tsx
3. **Automatic redirect** to `<AdminDashboard user={user} />`
4. **Purple admin interface** instead of regular expense tracker

## Quick Test

**In browser console after login:**
```javascript
// Check if user object has admin flag
const token = localStorage.getItem('auth_token');
console.log('Has token:', !!token);

// If you can access the React component state, check:
// user.is_admin should be true
```

## Most Likely Causes

1. **Browser cache**: Old frontend code cached
2. **Frontend not rebuilt**: Static Web App using old version without admin features
3. **Token issue**: Old token without admin data

## Quick Fix

1. **Clear all browser data** for your domain
2. **Hard refresh** the page
3. **Login again** with ladudarko
4. **Should see admin dashboard** with purple theme

If still not working, the frontend might need to be rebuilt with the latest admin code.
