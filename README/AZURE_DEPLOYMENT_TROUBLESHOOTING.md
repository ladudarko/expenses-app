# Azure App Service Deployment Troubleshooting

## Common Issues and Fixes

### Issue 1: App Not Starting

**Symptoms:**
- Health endpoint returns 404 or "Cannot GET /health"
- App Service shows "Your web app is running and waiting for your content"

**Fix:**
1. **Azure Portal** → Your App Service → **Configuration (preview)** → **Stack settings** tab
2. Set **Startup Command**: `npm run start`
3. Click **Save**
4. **Overview** → Click **Restart**

### Issue 2: Database Path Error

**Symptoms:**
- App starts but crashes
- Logs show: "ENOENT: no such file or directory" or database errors

**Fix:**
The database path is resolved relative to the compiled file location. Verify structure:

```
build/ (deployed root)
├── dist/
│   └── config/
│       └── database.js (uses ../../data/db.json)
├── data/
│   └── db.json (must exist here)
├── package.json
└── node_modules/
```

The workflow now automatically creates the `data/` directory. If still having issues:
1. Check Azure App Service → **Log stream** for path errors
2. Verify `data/db.json` exists in deployment
3. Check file permissions

### Issue 3: Missing Environment Variables

**Symptoms:**
- CORS errors
- Authentication fails
- Server errors

**Fix:**
**Azure Portal** → Your App Service → **Configuration** → **Application settings**

Add these required settings:

| Name | Value | Description |
|------|-------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `production` | Environment |
| `JWT_SECRET` | (generate secret) | JWT signing key |
| `FRONTEND_URL` | `https://icy-mud-054593f0f.3.azurestaticapps.net` | CORS origin |

**Generate JWT_SECRET:**
```bash
openssl rand -hex 32
```

After adding settings:
1. Click **Save**
2. **Overview** → **Restart**

### Issue 4: Module Not Found Errors

**Symptoms:**
- Logs show: "Cannot find module 'xxx'"
- App crashes on startup

**Fix:**
1. Check GitHub Actions build logs
2. Verify `npm ci --production` completed successfully
3. Ensure all dependencies are in `package.json` (not just devDependencies)
4. Check that `node_modules/` exists in deployment

### Issue 5: Deployment Structure Issues

**Symptoms:**
- Build succeeds but deployment fails
- Files not found errors

**Verify Deployment Structure:**

The workflow creates:
```
build/
├── dist/          (compiled TypeScript)
├── data/          (database directory)
├── package.json   (with start script)
└── node_modules/  (production dependencies)
```

Check GitHub Actions logs for "Verify build folder structure" step.

### Issue 6: Port Binding Error

**Symptoms:**
- Logs show: "EADDRINUSE" or port binding errors

**Fix:**
Azure App Service automatically sets `PORT` environment variable. Your code should use:
```javascript
const PORT = process.env.PORT || 3000;
```

✅ This is already correct in `server/src/index.ts`

### Issue 7: CORS Errors

**Symptoms:**
- Frontend can't connect to backend
- Browser console shows CORS errors

**Fix:**
1. **Backend App Service** → Configuration → Set `FRONTEND_URL`:
   ```
   https://icy-mud-054593f0f.3.azurestaticapps.net
   ```
   (No trailing slash)

2. **Frontend Static Web App** → Configuration → Set `VITE_API_URL`:
   ```
   https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/api
   ```

3. Restart both services after changes

## Checking Deployment Status

### 1. Check GitHub Actions
- Go to: `https://github.com/ladudarko/expenses-app/actions`
- Check "Deploy Node.js app to Azure Web App" workflow
- Look for red X (failed) or green checkmark (succeeded)
- Click on failed run → Check logs

### 2. Check Azure Log Stream
- **Azure Portal** → Your App Service → **Log stream**
- Look for:
  - ✅ "Server running on http://localhost:XXXX"
  - ✅ "BigSix AutoSales API is running"
  - ❌ Errors, stack traces, module not found

### 3. Test Health Endpoint
```bash
curl https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/health
```

Expected response:
```json
{"status":"ok","message":"BigSix AutoSales API is running"}
```

### 4. Check Deployment Files
- **Azure Portal** → App Service → **Advanced Tools (Kudu)** → Go
- **Debug console** → **CMD**
- Navigate to `site/wwwroot`
- Verify structure:
  - `dist/` folder exists
  - `package.json` exists
  - `node_modules/` exists
  - `data/` folder exists

## Quick Diagnostic Checklist

- [ ] Startup command set to `npm run start`
- [ ] `PORT` environment variable set (or uses default 3000)
- [ ] `NODE_ENV` = `production`
- [ ] `JWT_SECRET` set (generate with `openssl rand -hex 32`)
- [ ] `FRONTEND_URL` set correctly (no trailing slash)
- [ ] App Service restarted after configuration changes
- [ ] GitHub Actions build succeeded
- [ ] `dist/index.js` exists in deployment
- [ ] `node_modules/` exists in deployment
- [ ] `data/db.json` exists in deployment
- [ ] Health endpoint returns success

## Getting Detailed Error Logs

1. **Azure Portal** → App Service → **Log stream**
   - Shows real-time logs
   - Useful for startup errors

2. **Azure Portal** → App Service → **Logs** → **Application Logging**
   - Enable: **Application Logging (Filesystem)**
   - Level: **Verbose**
   - Save and check Log stream

3. **GitHub Actions Logs**
   - Check "Deploy Node.js app to Azure Web App" workflow
   - Expand failed steps
   - Look for error messages in build or deploy steps

4. **Kudu Console**
   - **Azure Portal** → App Service → **Advanced Tools (Kudu)** → Go
   - **Debug console** → **CMD**
   - Check `LogFiles/` for detailed logs

## Still Not Working?

If none of the above fixes work, share:
1. **GitHub Actions** workflow logs (full run)
2. **Azure Log Stream** output (last 50 lines)
3. **Health endpoint** response
4. **Startup Command** from Configuration

This will help identify the specific issue.

