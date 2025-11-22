# Fix CORS Error - Custom Domain Setup

## Problem

Getting CORS error when trying to login from your custom domain because the backend only allows requests from the configured `FRONTEND_URL`.

## Solution 1: Update FRONTEND_URL in App Service (Quick Fix)

1. **Azure Portal** → App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Configuration** → **Application settings**
3. Find `FRONTEND_URL` and update it:

**Option A: Single Custom Domain** (if you only want to use custom domain):
   - **Value**: `https://expenses.big6cloud.com` (your custom domain)
   - No trailing slash

**Option B: Multiple Domains** (supports both old and new URL):
   - **Value**: `https://expenses.big6cloud.com,https://icy-mud-054593f0f.3.azurestaticapps.net`
   - Comma-separated list of allowed origins
   - No trailing slashes

4. Click **Save**
5. **Overview** → Click **Restart**
6. Wait 1-2 minutes for restart

## Solution 2: Code Update (Already Done)

I've updated the backend code to:
- ✅ Support multiple origins (comma-separated in `FRONTEND_URL`)
- ✅ Automatically include the old Azure Static Web Apps URL as fallback
- ✅ Properly handle CORS for both old and new domains

After the deployment completes (GitHub Actions), the backend will support both:
- `https://icy-mud-054593f0f.3.azurestaticapps.net` (old URL)
- `https://expenses.big6cloud.com` (your custom domain - once added)

## Quick Fix Right Now

**Update `FRONTEND_URL` in App Service:**

1. Azure Portal → App Service → Configuration → Application settings
2. Update `FRONTEND_URL` to include **both** origins:
   ```
   https://expenses.big6cloud.com,https://icy-mud-054593f0f.3.azurestaticapps.net
   ```
3. **OR** if you only want the custom domain:
   ```
   https://expenses.big6cloud.com
   ```
4. Save and Restart

## Verify It's Fixed

1. After restarting App Service, wait 1-2 minutes
2. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
3. Try logging in from your custom domain
4. Check browser console - CORS errors should be gone

## Troubleshooting

### Still Getting CORS Error

1. **Check FRONTEND_URL** in App Service configuration:
   - Must match **exactly** (no trailing slash, correct protocol https)
   - If using multiple, format: `url1,url2` (no spaces)

2. **Verify Origin in Browser**:
   - Open Developer Tools (F12) → Network tab
   - Look at request headers
   - Check the `Origin` header value
   - Make sure it matches what's in `FRONTEND_URL`

3. **Restart App Service**:
   - Overview → Restart
   - Wait for restart to complete

4. **Check Backend Logs**:
   - App Service → Log stream
   - Look for CORS errors or successful requests

### Multiple Origins Format

If you want to allow multiple domains, use comma-separated:
```
https://expenses.big6cloud.com,https://icy-mud-054593f0f.3.azurestaticapps.net
```

After the code update deploys, this format will work automatically.

---

**Current Status:**
- ✅ Code updated to support multiple origins
- ⏳ Deployment in progress (GitHub Actions)
- ⏳ Need to update `FRONTEND_URL` in App Service configuration

