# Check Why App Service Workflow Isn't Running

## Quick Checklist

### 1. Verify Workflow File is Pushed

The workflow file exists and is committed, but make sure it's pushed:

```bash
git log --oneline --all -- .github/workflows/azure-webapps-deploy.yml
```

Should show commits like "Add App Service deployment"

### 2. Check GitHub Actions

1. Go to: `https://github.com/ladudarko/expenses-app/actions`
2. Look for a workflow called **"Deploy Node.js app to Azure Web App"**
3. Check if it's:
   - ❌ Not showing up at all (missing secret or error)
   - ⚠️ Showing as failed (check logs)
   - ⏸️ Not triggered (no recent push)

### 3. Missing Secret Check

The workflow requires this secret:
- `AZURE_WEBAPP_PUBLISH_PROFILE`

If this secret doesn't exist:
1. Go to: `https://github.com/ladudarko/expenses-app/settings/secrets/actions`
2. Check if `AZURE_WEBAPP_PUBLISH_PROFILE` exists
3. If missing, the workflow will fail silently

### 4. Manual Trigger

Try manually triggering the workflow:

1. Go to: `https://github.com/ladudarko/expenses-app/actions`
2. Click on **"Deploy Node.js app to Azure Web App"** workflow
3. Click **"Run workflow"** button (if available)
4. Select branch: `main`
5. Click **"Run workflow"**

This will show any errors immediately.

### 5. Check Recent Push

Make sure you pushed after creating the workflow:

```bash
git log --oneline -5
```

Should show recent commits with the workflow file.

---

## Expected Behavior

When the workflow runs, you should see:

1. **Two workflows** in GitHub Actions:
   - ✅ `Azure Static Web Apps CI/CD` (frontend - working)
   - ✅ `Deploy Node.js app to Azure Web App` (backend - should run)

2. **If backend workflow doesn't exist:**
   - Secret is missing
   - Workflow file has syntax errors
   - GitHub hasn't picked up the file yet

3. **If backend workflow exists but fails:**
   - Check the logs
   - Look for: "Secret not found", "App Service not found", etc.

---

## Quick Fix

### Step 1: Ensure Workflow File is Pushed

```bash
git add .github/workflows/azure-webapps-deploy.yml
git commit -m "Add App Service deployment workflow"
git push origin main
```

### Step 2: Create Azure App Service (if not done)

1. Azure Portal → Create **Web App**
2. Name: `expenses-tracker-backend`
3. Runtime: Node 18 LTS, Linux
4. Create

### Step 3: Get Publish Profile

1. Azure Portal → Your App Service
2. Click **"Get publish profile"**
3. Copy entire file content

### Step 4: Add GitHub Secret

1. Go to: `https://github.com/ladudarko/expenses-app/settings/secrets/actions`
2. Click **"New repository secret"**
3. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Value: Paste publish profile content
5. Click **"Add secret"**

### Step 5: Update Workflow File

Edit `.github/workflows/azure-webapps-deploy.yml` line 11:

```yaml
AZURE_WEBAPP_NAME: expenses-tracker-backend  # Change to your actual App Service name
```

### Step 6: Push Again

```bash
git add .github/workflows/azure-webapps-deploy.yml
git commit -m "Update App Service name"
git push origin main
```

### Step 7: Check Actions

After push, check: `https://github.com/ladudarko/expenses-app/actions`

You should now see **both workflows** running!

---

## If Still Not Working

1. **Check workflow syntax:**
   - GitHub → Actions → "Deploy Node.js app to Azure Web App"
   - Look for red X or error messages

2. **Verify secret exists:**
   - Settings → Secrets and variables → Actions
   - Must see `AZURE_WEBAPP_PUBLISH_PROFILE`

3. **Check App Service name:**
   - Must match exactly (case-sensitive)
   - No extra spaces

4. **Try manual trigger:**
   - Actions → "Deploy Node.js app to Azure Web App"
   - Click "Run workflow"

