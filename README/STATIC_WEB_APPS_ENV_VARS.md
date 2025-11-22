# Fix: Azure Static Web Apps Environment Variables

## Problem

Azure Static Web Apps doesn't automatically pass environment variables from the portal to the build process. Vite environment variables need to be available **during build time** in GitHub Actions.

## Solution

I've updated the workflow to pass `VITE_API_URL` as an environment variable during the build process.

## How It Works

The workflow now sets `VITE_API_URL` in two places:

1. **Job-level environment variable**: Available to all steps
2. **Step-level environment variable**: Explicitly passed to the build step

This ensures Vite can access `VITE_API_URL` during the build and embed it in the production bundle.

## What Changed

```yaml
# Added to workflow:
env:
  VITE_API_URL: https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/api

# And in the build step:
env:
  VITE_API_URL: https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/api
```

## Next Steps

1. **Wait for GitHub Actions** to complete:
   - Go to: `https://github.com/ladudarko/expenses-app/actions`
   - Check "Azure Static Web Apps CI/CD" workflow
   - Wait for green checkmark

2. **Wait 2-3 minutes** after deployment completes

3. **Clear Browser Cache**:
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or hard refresh

4. **Test Again**:
   - Open Developer Tools (F12)
   - Go to Network tab
   - Try to register/login
   - Check request URL should now be: `https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/api/auth/register`

## Restarting Static Web Apps

**Note:** Azure Static Web Apps don't need to be "restarted" like App Service. They're just static files served from a CDN. The "restart" happens automatically when you redeploy.

To trigger a redeploy:
- **Push a new commit** (which I just did)
- Or manually trigger the workflow in GitHub Actions

## Verification

After deployment, check that the built files have the correct API URL:
1. Visit your Static Web App
2. Open Developer Tools → Network tab
3. Look at the request URL when you try to login/signup
4. Should be the Azure backend URL, NOT localhost

---

**Status**: ✅ Workflow updated - waiting for rebuild

