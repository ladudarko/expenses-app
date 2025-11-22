# Hybrid Deployment Setup - Quick Start

## ✅ What's Configured

1. **Frontend Workflow** (`.github/workflows/azure-static-web-apps-icy-mud-054593f0f.yml`):
   - ✅ Output location set to `dist` (Vite default)
   - ✅ Builds React app automatically

2. **Backend Workflow** (`.github/workflows/azure-webapps-deploy.yml`):
   - ✅ Builds TypeScript to JavaScript
   - ✅ Creates `build` folder with compiled code
   - ✅ Deploys to Azure App Service

3. **Frontend API Configuration** (`src/services/api.ts`):
   - ✅ Reads `VITE_API_URL` from environment
   - ✅ Falls back to `http://localhost:3000/api` for local dev

---

## 🚀 Next Steps

### Step 1: Configure Backend (Azure App Service)

1. **Create App Service** in Azure Portal
   - Runtime: Node 18 LTS
   - Name: `expenses-tracker-backend` (or your choice)

2. **Add Environment Variables** (Configuration → Application settings):
   ```
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=your-super-secret-key-here
   FRONTEND_URL=https://your-static-web-app.azurestaticapps.net
   ```

3. **Add GitHub Secret**:
   - Repo → Settings → Secrets → Actions
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: Download from Azure Portal → App Service → "Get publish profile"

4. **Update Workflow** (if needed):
   - Edit `.github/workflows/azure-webapps-deploy.yml`
   - Set `AZURE_WEBAPP_NAME` to your App Service name

---

### Step 2: Configure Frontend (Azure Static Web Apps)

1. **Static Web App is already created** (if you see the workflow file)

2. **Add Environment Variable** (Configuration → Application settings):
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-app-service.azurewebsites.net/api`
   
   **Note:** You may need to redeploy after adding this variable since Vite embeds env vars at build time.

3. **Verify Workflow** (already done):
   - ✅ `output_location: "dist"` is correct

---

### Step 3: Configure CORS

Backend needs to allow requests from your Static Web App:

1. Go to **App Service** → Configuration
2. Set `FRONTEND_URL` = Your Static Web App URL
   - Example: `https://icy-mud-054593f0f.azurestaticapps.net`

---

### Step 4: Deploy

```bash
git add .
git commit -m "Configure hybrid Azure deployment"
git push origin main
```

Both workflows will trigger automatically!

---

## 🔍 Verify Deployment

1. **Backend Health Check:**
   ```
   https://your-backend-app-service.azurewebsites.net/health
   ```
   Should return: `{"status":"ok","message":"BigSix AutoSales API is running"}`

2. **Frontend:**
   ```
   https://your-static-web-app.azurestaticapps.net
   ```
   Should load the React app

3. **Test Login:**
   - Try logging in with your credentials
   - Check browser console for API errors

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

1. Check `VITE_API_URL` in Static Web App configuration
2. **Important:** Redeploy frontend after adding environment variable
3. Check browser console network tab for CORS errors
4. Verify `FRONTEND_URL` in App Service matches Static Web App URL

### Build Fails

**Frontend:**
- Check GitHub Actions → Static Web Apps workflow
- Ensure `output_location: "dist"` is set
- Verify `npm run build` works locally

**Backend:**
- Check GitHub Actions → App Service workflow
- Look for "Verify build folder" steps
- Ensure `build` folder is created correctly

### Backend Doesn't Start

1. Check App Service → Log stream
2. Verify startup command: `npm run start`
3. Check environment variables are set
4. Verify `dist/index.js` exists in deployment

---

## 📝 Environment Variables Reference

### Backend (App Service)
```
PORT=3000
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
FRONTEND_URL=https://your-static-web-app.azurestaticapps.net
```

### Frontend (Static Web Apps)
```
VITE_API_URL=https://your-backend-app-service.azurewebsites.net/api
```

---

## 🔄 Redeploy After Env Var Changes

**Frontend:** After changing `VITE_API_URL`, trigger a redeploy:
- Azure Portal → Static Web App → "Redeploy"
- Or push an empty commit: `git commit --allow-empty -m "Redeploy frontend" && git push`

**Backend:** Environment variable changes take effect immediately (restart happens automatically)

---

## 📚 Full Documentation

See `DEPLOYMENT.md` for complete setup instructions.

