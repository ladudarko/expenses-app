# Azure Hybrid Deployment Guide

This guide covers deploying the expenses app using the **hybrid approach**:
- **Frontend (React SPA)** → Azure Static Web Apps
- **Backend (Express API)** → Azure App Service

## Architecture Overview

```
GitHub Repository (main branch)
├── Frontend Build → Azure Static Web Apps
│   ├── Builds React app with Vite
│   ├── Outputs to `dist/` folder
│   └── Deploys to global CDN
│
└── Backend Build → Azure App Service
    ├── Builds TypeScript to JavaScript
    ├── Outputs to `server/dist/` folder
    └── Runs Express server with `npm run start`
```

## Prerequisites

1. Azure account with active subscription
2. GitHub repository: `https://github.com/ladudarko/expenses-app`
3. Two Azure resources:
   - **Azure Static Web App** (for frontend)
   - **Azure App Service** (for backend)

---

## Part 1: Backend Deployment (Azure App Service)

### 1. Create Azure App Service

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a resource → **Web App**
3. Configure:
   - **Name**: `expenses-tracker-backend` (or your choice)
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Pricing plan**: Basic B1 or higher
4. Click **Create**

### 2. Configure App Service Environment Variables

1. Go to your App Service → **Configuration** → **Application settings**
2. Add these settings:

   | Name | Value | Example |
   |------|-------|---------|
   | `PORT` | `3000` | `3000` |
   | `NODE_ENV` | `production` | `production` |
   | `JWT_SECRET` | Generate strong secret | `your-super-secret-jwt-key-change-in-production-12345` |
   | `FRONTEND_URL` | Your Static Web App URL | `https://icy-mud-054593f0f.azurestaticapps.net` |

3. Click **Save**

### 3. Configure GitHub Actions Secret

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secret:
   - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Value**: Download from Azure Portal → Your App Service → **Get publish profile** (copy entire file content)

### 4. Update App Service Name (if different)

Edit `.github/workflows/azure-webapps-deploy.yml`:
```yaml
AZURE_WEBAPP_NAME: expenses-tracker-backend  # Change to your App Service name
```

### 5. Configure Startup Command

1. Go to Azure Portal → Your App Service → **Configuration (preview)** → **Stack settings** tab
2. Set **Startup Command**: `npm run start`
3. Click **Save**

---

## Part 2: Frontend Deployment (Azure Static Web Apps)

### 1. Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a resource → **Static Web App**
3. Configure:
   - **Subscription**: Your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: Auto-generated or custom
   - **Plan type**: Free (for development)
   - **Region**: Closest to you
   - **Source**: GitHub
   - **GitHub account**: Authorize Azure
   - **Organization**: `ladudarko`
   - **Repository**: `expenses-app`
   - **Branch**: `main`
   - **Build Presets**: Custom
     - **App location**: `/`
     - **Api location**: (leave empty)
     - **Output location**: `dist`

4. Click **Review + create** → **Create**

### 2. Configure Frontend Environment Variable

**For Production Build (Azure Static Web Apps):**

1. Go to Azure Portal → Your Static Web App → **Configuration** → **Application settings**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-app-service.azurewebsites.net/api`

**Note:** Vite environment variables must start with `VITE_` and are embedded at build time.

### 3. Verify Workflow File

The workflow file `.github/workflows/azure-static-web-apps-icy-mud-054593f0f.yml` should have:
```yaml
output_location: "dist"  # ✅ Correct (Vite outputs to dist)
```

---

## Part 3: CORS Configuration

Your backend already has CORS configured to accept requests from the `FRONTEND_URL` environment variable. Make sure:

1. **Backend App Service** → Configuration → `FRONTEND_URL` = Your Static Web App URL
2. **Frontend Static Web App** → Configuration → `VITE_API_URL` = Your Backend App Service URL + `/api`

---

## Part 4: Database Setup

Currently using JSON file (`server/data/db.json`). For production:

### Option 1: Azure Files (Temporary Solution)

1. Create Azure Storage Account
2. Create File Share
3. Mount to App Service → **Configuration** → **Path mappings**
4. Update `DB_PATH` environment variable

### Option 2: Azure Database for PostgreSQL (Recommended)

1. Create **Azure Database for PostgreSQL** server
2. Run schema: `server/src/config/schema.sql`
3. Update backend to use PostgreSQL connection string
4. Store connection string in App Service Configuration

---

## Deployment Process

Once configured:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure hybrid Azure deployment"
   git push origin main
   ```

2. **Monitor Deployments:**
   - Frontend: GitHub → **Actions** → `Azure Static Web Apps CI/CD`
   - Backend: GitHub → **Actions** → `Deploy Node.js app to Azure Web App`

3. **Verify Deployments:**
   - **Frontend**: Visit Static Web App URL
   - **Backend**: Visit `https://your-backend-app-service.azurewebsites.net/health`

---

## Troubleshooting

### Frontend Can't Connect to Backend

1. Check `VITE_API_URL` in Static Web App configuration
2. Check `FRONTEND_URL` in App Service configuration
3. Verify CORS settings in backend
4. Check browser console for network errors

### Backend Build Fails: "build folder not found"

The workflow creates a `build` folder with the compiled backend. Check GitHub Actions logs for:
- "Verify build folder structure" step
- "Verify build folder exists" step

### Frontend Build Fails: "build folder not found"

The Static Web Apps workflow expects `dist` folder (Vite output). Verify:
- `output_location: "dist"` in workflow file
- Vite builds successfully (`npm run build` outputs to `dist/`)

### Database Issues

JSON file doesn't persist across App Service restarts. Use:
- Azure Files (mounted volume)
- Azure Database for PostgreSQL (recommended)

---

## URLs After Deployment

- **Frontend**: `https://icy-mud-054593f0f.azurestaticapps.net` (or your Static Web App URL)
- **Backend API**: `https://expenses-tracker-backend.azurewebsites.net/api` (or your App Service URL)

---

## Next Steps

1. ✅ Configure both services
2. ✅ Set environment variables
3. ✅ Deploy and test
4. ⬜ Migrate to PostgreSQL for production
5. ⬜ Set up custom domains
6. ⬜ Enable Application Insights for monitoring
7. ⬜ Configure backup strategy

---

## Cost Estimate

- **Azure Static Web Apps**: Free tier (100GB bandwidth/month)
- **Azure App Service**: Basic B1 (~$13/month) or Free tier (limited)
- **Azure Database for PostgreSQL**: Basic tier (~$25-50/month) when you migrate

**Total**: ~$13-50/month depending on tier selection.
