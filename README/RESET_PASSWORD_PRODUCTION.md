# How to Reset User Passwords in Production

This guide explains how to reset user passwords in the production Azure Web App environment.

## Prerequisites

- Access to Azure Portal
- Your Azure Web App name: `expenses-tracker-backend`

## Method 1: Using Azure Kudu Console (Recommended)

### Step 1: Access Kudu Console

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service: `expenses-tracker-backend`
3. Go to **Development Tools** → **Advanced Tools (Kudu)** → **Go**
4. Or directly visit: `https://expenses-tracker-backend.scm.azurewebsites.net`

### Step 2: Open Debug Console

1. Click on **Debug console** → **CMD** (or **PowerShell**)
2. Navigate to the app directory:
   ```bash
   cd site/wwwroot
   ```

### Step 3: Run the Password Reset Script

```bash
# Navigate to scripts directory
cd scripts

# Reset password for a user
node reset-user-password.js <username> [new-password]

# Examples:
node reset-user-password.js admin mynewpassword
node reset-user-password.js leo password123
```

## Method 2: Using Azure Cloud Shell

### Step 1: Open Azure Cloud Shell

1. Go to [Azure Portal](https://portal.azure.com)
2. Click the **Cloud Shell** icon (top right)
3. Choose **Bash** or **PowerShell**

### Step 2: Connect to Your App Service

```bash
# Install Azure CLI if not already installed
az webapp ssh --name expenses-tracker-backend --resource-group <your-resource-group>
```

### Step 3: Run the Script

Once connected, navigate and run:
```bash
cd /home/site/wwwroot/scripts
node reset-user-password.js <username> [new-password]
```

## Method 3: Using Azure App Service SSH (if enabled)

### Step 1: Enable SSH

1. Go to Azure Portal → Your App Service
2. Go to **Configuration** → **General settings**
3. Enable **SSH**
4. Save

### Step 2: Connect via SSH

```bash
az webapp ssh --name expenses-tracker-backend --resource-group <your-resource-group>
```

### Step 3: Run the Script

```bash
cd /home/site/wwwroot/scripts
node reset-user-password.js <username> [new-password]
```

## Method 4: Using Azure Portal Console (Simplest)

### Step 1: Access Console

1. Go to Azure Portal → Your App Service
2. Go to **Development Tools** → **Console**
3. Or visit: `https://portal.azure.com` → Your App Service → **Console**

### Step 2: Run the Script

```bash
cd scripts
node reset-user-password.js <username> [new-password]
```

## Script Usage

```bash
# Reset password with custom password
node reset-user-password.js admin mynewpassword

# Reset password with default password (password123)
node reset-user-password.js leo

# View usage help
node reset-user-password.js
```

## Important Notes

⚠️ **Security Warning:**
- The script will display the new password in the console
- Make sure to change the password after logging in
- Only use this in secure environments

⚠️ **Data Persistence:**
- The password change is saved to `data/db.json`
- This file persists on Azure Web App's file system
- However, Azure Web App storage is ephemeral - consider using a proper database for production

## Troubleshooting

### Script Not Found
If the script is not found, check:
1. The script was deployed (check `site/wwwroot/scripts/` directory)
2. You're in the correct directory
3. The deployment workflow includes the scripts directory

### Permission Denied
If you get permission errors:
1. Make sure you have the correct Azure permissions
2. Try using Kudu console instead of SSH
3. Check that the file exists: `ls -la scripts/reset-user-password.js`

### Database File Not Found
If the database file is not found:
1. Check if `data/db.json` exists: `ls -la data/db.json`
2. The script will create the directory structure if needed
3. Make sure the deployment copied the data directory

## Alternative: Create API Endpoint (More Secure)

For a more secure approach, consider creating an admin API endpoint to reset passwords instead of using scripts. This would:
- Require authentication
- Not expose passwords in console output
- Be accessible via HTTP requests
- Provide better audit logging

