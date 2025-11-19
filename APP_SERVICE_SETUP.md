# Azure App Service Setup Guide

## Step-by-Step: Create and Deploy Backend to App Service

### Step 1: Create Azure App Service

1. **Go to Azure Portal:**
   - Visit [https://portal.azure.com](https://portal.azure.com)
   - Sign in

2. **Create Web App:**
   - Click **+ Create a resource**
   - Search for **"Web App"** or **"App Service"**
   - Click **Create**

3. **Configure Basics:**
   - **Subscription**: Select your subscription
   - **Resource Group**: 
     - Create new: `rg-expenses-tracker` (or use existing)
   - **Name**: `expenses-tracker-backend` (must be globally unique)
     - Add random numbers if taken: `expenses-tracker-backend-12345`
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: Choose closest to you (e.g., East US, West Europe)

4. **Configure App Service Plan:**
   - **Linux Plan**: 
     - Create new or use existing
   - **Pricing tier**: 
     - **Free (F1)** for testing (limited)
     - **Basic B1** recommended (~$13/month)
   - Click **Review + create** → **Create**

5. **Wait for deployment** (2-3 minutes)

---

### Step 2: Get Publish Profile

1. **Go to your App Service:**
   - After creation, click **Go to resource**

2. **Download Publish Profile:**
   - Click **Get publish profile** button (downloads `.PublishSettings` file)
   - **SAVE THIS FILE** - you'll need its contents

3. **Copy the entire file content:**
   - Open the downloaded file in a text editor
   - Copy ALL the content (it's XML)

---

### Step 3: Configure GitHub Secret

1. **Go to GitHub Repository:**
   - Visit `https://github.com/ladudarko/expenses-app`
   - Go to **Settings** → **Secrets and variables** → **Actions**

2. **Add Secret:**
   - Click **New repository secret**
   - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Secret**: Paste the entire content from the `.PublishSettings` file
   - Click **Add secret**

---

### Step 4: Update Workflow File

1. **Edit `.github/workflows/azure-webapps-deploy.yml`**
   - Line 11: Change `AZURE_WEBAPP_NAME` to your App Service name
   - Example: `AZURE_WEBAPP_NAME: expenses-tracker-backend`

2. **Commit and push:**
   ```bash
   git add .github/workflows/azure-webapps-deploy.yml
   git commit -m "Add App Service deployment workflow"
   git push origin main
   ```

---

### Step 5: Configure App Service Settings

1. **Go to App Service in Azure Portal**

2. **Set Startup Command:**
   - Go to **Configuration (preview)** → **Stack settings** tab
   - **Startup Command**: `npm run start`
   - Click **Save**

3. **Add Environment Variables** (Configuration → Application settings):
   - Click **+ New application setting** for each:

   | Name | Value | Example |
   |------|-------|---------|
   | `PORT` | `3000` | `3000` |
   | `NODE_ENV` | `production` | `production` |
   | `JWT_SECRET` | Generate strong secret | `your-super-secret-jwt-key-change-me-12345` |
   | `FRONTEND_URL` | Your Static Web App URL | `https://icy-mud-054593f0f.azurestaticapps.net` |

4. **Click Save** and wait for restart

---

### Step 6: Verify Deployment

1. **Check GitHub Actions:**
   - Go to your repo → **Actions** tab
   - Look for **"Deploy Node.js app to Azure Web App"** workflow
   - Should run automatically after push
   - Wait for it to complete (green checkmark)

2. **Test Backend:**
   - Visit: `https://your-app-service-name.azurewebsites.net/health`
   - Should return: `{"status":"ok","message":"BigSix AutoSales API is running"}`

3. **Check Logs (if issues):**
   - Azure Portal → App Service → **Log stream**
   - Or **Logs** → **Application Logging** → Enable if needed

---

## Troubleshooting

### Workflow Fails: "Secret not found"
- Verify `AZURE_WEBAPP_PUBLISH_PROFILE` secret exists in GitHub
- Check the secret name matches exactly (case-sensitive)

### Workflow Fails: "App Service not found"
- Verify `AZURE_WEBAPP_NAME` in workflow file matches your App Service name exactly
- Check Azure Portal for the exact name

### Backend Returns 404 or Error
- Check **Log stream** in Azure Portal
- Verify startup command: `npm run start`
- Check environment variables are set correctly

### Health Endpoint Doesn't Work
- Visit: `https://your-app.azurewebsites.net/health`
- Check Log stream for errors
- Verify the app started successfully

---

## Quick Checklist

- [ ] App Service created in Azure Portal
- [ ] Publish profile downloaded
- [ ] `AZURE_WEBAPP_PUBLISH_PROFILE` secret added to GitHub
- [ ] `AZURE_WEBAPP_NAME` updated in workflow file
- [ ] Workflow file committed and pushed
- [ ] GitHub Actions workflow completed successfully
- [ ] Startup command set: `npm run start`
- [ ] Environment variables configured
- [ ] Health endpoint returns success: `/health`

---

## After Deployment

Once backend is deployed:

1. **Update Frontend API URL:**
   - Azure Portal → Static Web App → **Configuration** → **Application settings**
   - Add: `VITE_API_URL` = `https://your-app-service.azurewebsites.net/api`
   - Redeploy frontend

2. **Test Login:**
   - Visit your Static Web Apps site
   - Register a new user or login
   - Should connect to backend now!

---

## Need Help?

If you're stuck:
1. Check GitHub Actions logs (detailed error messages)
2. Check Azure Portal → App Service → Log stream
3. Verify all steps above are completed
4. Make sure App Service name matches in workflow file

