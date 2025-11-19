# Azure Deployment Guide

## Prerequisites

1. Azure account with active subscription
2. GitHub repository: `https://github.com/ladudarko/expenses-app`
3. Azure App Service created for backend

## GitHub Actions Setup

### 1. Configure Azure App Service Secret

1. Go to your GitHub repository: `https://github.com/ladudarko/expenses-app`
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   | Secret Name | Value | How to Get |
   |------------|-------|------------|
   | `AZURE_WEBAPP_PUBLISH_PROFILE` | Download from Azure Portal | See below |
   | `AZURE_WEBAPP_NAME` | Your App Service name | From Azure Portal |

### 2. Get Publish Profile from Azure

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service
3. Click **Get publish profile** button (downloads an `.PublishSettings` file)
4. Open the file and copy its contents
5. Paste into the `AZURE_WEBAPP_PUBLISH_PROFILE` secret in GitHub

### 3. Set App Service Name

1. In GitHub repo settings, add a repository secret:
   - Name: `AZURE_WEBAPP_NAME`
   - Value: Your App Service name (e.g., `bigsix-expenses-api`)

   **OR** edit `.github/workflows/azure-webapps-deploy.yml` and replace:
   ```yaml
   AZURE_WEBAPP_NAME: your-app-service-name
   ```
   with your actual App Service name.

## App Service Configuration

### Environment Variables

In Azure Portal > App Service > Configuration > Application settings, add:

| Name | Value | Example |
|------|-------|---------|
| `PORT` | `3000` | `3000` |
| `NODE_ENV` | `production` | `production` |
| `JWT_SECRET` | Generate strong secret | `your-super-secret-jwt-key-change-in-production` |
| `FRONTEND_URL` | Your frontend URL | `https://your-frontend.azurewebsites.net` |

**Note:** For production, store `JWT_SECRET` in Azure Key Vault for better security.

### Startup Command

In Azure Portal > App Service > Configuration > General settings, set:

**Startup Command:** `npm run start`

This runs `node dist/index.js` as defined in `server/package.json`.

## Deployment Process

Once configured:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure Azure deployment"
   git push origin main
   ```

2. **Monitor Deployment:**
   - Go to GitHub repository > **Actions** tab
   - Watch the workflow run
   - Check for any errors

3. **Verify Deployment:**
   - Visit: `https://<your-app-service-name>.azurewebsites.net/health`
   - Should return: `{"status":"ok","message":"BigSix AutoSales API is running"}`

## Troubleshooting

### Build Fails: "build folder not found"

The workflow creates a `build` folder with:
- `dist/` - Compiled JavaScript
- `package.json` - Server package file
- `node_modules/` - Production dependencies

If this error persists, check:
- GitHub Actions logs for build errors
- Ensure `npm run build` completes successfully in the `server/` directory

### App Service Doesn't Start

1. Check **Log stream** in Azure Portal
2. Verify startup command: `npm run start`
3. Check environment variables are set correctly
4. Verify `PORT` environment variable (Azure injects this automatically)

### Database Issues

Currently using JSON file (`server/data/db.json`). For production:

1. **Option 1:** Mount Azure Files share (survives restarts)
2. **Option 2:** Migrate to Azure Database for PostgreSQL (recommended)

See [DATABASE.md](./DATABASE.md) for migration guide.

## Next Steps

1. Deploy frontend (Azure Static Web Apps recommended)
2. Set up Azure Database for PostgreSQL
3. Configure custom domain
4. Enable Application Insights for monitoring
