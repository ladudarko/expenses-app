# Fix "Failed to Fetch" Login Error

## Problem

The frontend is trying to call `http://localhost:3000/api`, which doesn't exist in production. The backend needs to be deployed to Azure App Service first.

## Solution (3 Steps)

### Step 1: Deploy Backend to Azure App Service

The App Service workflow has been recreated. Now you need to:

1. **Create Azure App Service** (if not done):
   - Azure Portal → Create → Web App
   - Name: `expenses-tracker-backend` (must be unique, add numbers if taken)
   - Runtime: Node 18 LTS
   - OS: Linux
   - Plan: Free (F1) or Basic B1
   - Click **Create**

2. **Get Publish Profile**:
   - Azure Portal → Your App Service
   - Click **"Get publish profile"** (downloads `.PublishSettings` file)
   - Open the file and copy **ALL** content

3. **Add GitHub Secret**:
   - Go to: `https://github.com/ladudarko/expenses-app/settings/secrets/actions`
   - Click **"New repository secret"**
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: Paste entire `.PublishSettings` file content
   - Click **"Add secret"**

4. **Update Workflow File** (if App Service name is different):
   - Edit `.github/workflows/azure-webapps-deploy.yml`
   - Line 11: Change to your actual App Service name:
     ```yaml
     AZURE_WEBAPP_NAME: expenses-tracker-backend  # Your actual name
     ```
   - Commit and push:
     ```bash
     git add .github/workflows/azure-webapps-deploy.yml
     git commit -m "Add App Service deployment"
     git push origin main
     ```

5. **Configure App Service** (after deployment):
   - Azure Portal → Your App Service → **Configuration**
   - **General settings**:
     - Startup Command: `npm run start`
   - **Application settings** (click "New application setting"):
     - `PORT` = `3000`
     - `NODE_ENV` = `production`
     - `JWT_SECRET` = (generate a strong secret, e.g., `openssl rand -hex 32`)
     - `FRONTEND_URL` = `https://icy-mud-054593f0f.3.azurestaticapps.net`
   - Click **Save**

### Step 2: Set Frontend API URL in Static Web Apps

After the backend is deployed, configure the frontend:

1. **Get Backend URL**:
   - Azure Portal → Your App Service
   - Copy the URL: `https://your-app-service-name.azurewebsites.net`
   - Backend API URL: `https://your-app-service-name.azurewebsites.net/api`

2. **Configure Static Web App**:
   - Azure Portal → Your Static Web App
   - Go to **Configuration** → **Environment variables**
   - Click **Add**:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://your-app-service-name.azurewebsites.net/api`
     - Click **OK**
   - Click **Save**

3. **Trigger Redeploy**:
   - After saving, go to **Deployment** → Click **"Redeploy"** or push a new commit:
     ```bash
     git commit --allow-empty -m "Trigger redeploy with API URL"
     git push origin main
     ```

### Step 3: Verify

1. **Check Backend**:
   - Visit: `https://your-app-service-name.azurewebsites.net/health`
   - Should return: `{"status":"ok","message":"BigSix AutoSales API is running"}`

2. **Check Frontend**:
   - Visit: `https://icy-mud-054593f0f.3.azurestaticapps.net`
   - Try to sign up/login
   - Should work now!

## Quick Checklist

- [ ] Backend App Service created
- [ ] GitHub secret `AZURE_WEBAPP_PUBLISH_PROFILE` added
- [ ] Backend deployed (check GitHub Actions)
- [ ] App Service configured (PORT, NODE_ENV, JWT_SECRET, FRONTEND_URL)
- [ ] Static Web App environment variable `VITE_API_URL` set
- [ ] Frontend redeployed
- [ ] Backend health check works
- [ ] Login works on frontend

## Troubleshooting

### Backend health check fails:
- Check App Service logs: Azure Portal → App Service → Log stream
- Verify startup command: `npm run start`
- Check that `package.json` has `"start": "node dist/index.js"`

### Login still fails:
- Open browser console (F12) → Network tab
- Check if API calls are going to the correct URL
- Verify CORS settings in backend (FRONTEND_URL must match Static Web App URL)
- Check backend logs for CORS errors

### Environment variable not working:
- Make sure variable name is exactly `VITE_API_URL`
- Variables starting with `VITE_` are exposed to frontend in Vite
- After changing, trigger a redeploy (push a new commit)

---

**Current Status:**
- ✅ Frontend deployed (Static Web Apps)
- ✅ App Service workflow recreated
- ⏳ Backend needs to be deployed (Step 1)
- ⏳ Frontend needs API URL configured (Step 2)

