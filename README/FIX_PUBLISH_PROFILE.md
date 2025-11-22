# Fix Publish Profile Error

## Problem

The error "Publish profile is invalid for app-name and slot-name provided" occurs because:
- The publish profile's `msdeploySite` is `expenses-tracker-backend`
- But the workflow uses App Service name: `expenses-tracker-backend-b4cxc0etfnaabqb9`

## Solution: Update GitHub Secret with Fresh Publish Profile

### Step 1: Download Fresh Publish Profile

1. **Azure Portal** → Your App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. Click **Get publish profile** button
3. Save the `.PublishSettings` file
4. **Open the file** and copy **ALL** content (entire XML)

### Step 2: Update GitHub Secret

1. Go to: `https://github.com/ladudarko/expenses-app/settings/secrets/actions`
2. Find `AZURE_WEBAPP_PUBLISH_PROFILE` secret
3. Click **Update** (pencil icon)
4. **Delete** all old content
5. **Paste** the entire new publish profile XML
6. Click **Update secret**

### Step 3: Verify Workflow App Name

The workflow should use the **full App Service name** (which it does):
```yaml
AZURE_WEBAPP_NAME: expenses-tracker-backend-b4cxc0etfnaabqb9
```

This is correct - don't change it.

### Step 4: Redeploy

The workflow will automatically run on the next push, or you can manually trigger it:

1. Go to: `https://github.com/ladudarko/expenses-app/actions`
2. Click **"Deploy Node.js app to Azure Web App"**
3. Click **"Run workflow"** → **"Run workflow"**

---

## Alternative: Use Site Name from Publish Profile (if above doesn't work)

If updating the secret doesn't work, the issue might be that Azure uses a different name internally. Check the publish profile for the actual site name used by MSDeploy.

The publish profile shows:
- `msdeploySite="expenses-tracker-backend"` 

But the actual App Service might be: `expenses-tracker-backend-b4cxc0etfnaabqb9`

In this case, you might need to create a new App Service or ensure the publish profile matches. However, **try updating the secret first** - that usually fixes it.

---

## Quick Checklist

- [ ] Downloaded fresh publish profile from Azure Portal
- [ ] Updated `AZURE_WEBAPP_PUBLISH_PROFILE` secret in GitHub with entire XML content
- [ ] Verified workflow uses correct App Service name
- [ ] Triggered new deployment
- [ ] Checked GitHub Actions for success

---

## If Still Not Working

1. **Verify publish profile is correct:**
   - Open the `.PublishSettings` file
   - Check `destinationAppUrl` matches your App Service URL
   - Check it's from the correct App Service

2. **Check for typos in secret:**
   - Make sure no extra spaces
   - Make sure entire XML is copied (from `<publishData>` to `</publishData>`)

3. **Try regenerating publish profile:**
   - Sometimes publish profiles expire or become invalid
   - Download a fresh one and update the secret

