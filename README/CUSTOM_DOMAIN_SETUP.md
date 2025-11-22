# Add Custom Domain to Azure Static Web Apps

## Overview

Your current frontend URL is:
- `https://icy-mud-054593f0f.3.azurestaticapps.net`

You can add a custom domain like:
- `https://expenses.bigsixautosales.com`
- `https://tracker.bigsixautosales.com`
- Or any domain you own

## Step-by-Step Guide

### Step 1: Add Custom Domain in Azure Portal

1. **Azure Portal** → Your Static Web App: `expenses-app`
2. Click **Custom domains** in the left menu
3. Click **+ Add** button
4. Choose domain type:
   - **Production domain** (recommended) - Points directly to your app
   - **Preview domain** - For testing/staging

### Step 2: Configure Your Domain Provider

Azure will show you what DNS records to add. You have two options:

#### Option A: Using Apex Domain (e.g., `bigsixautosales.com`)

You'll need to add DNS records in your domain provider:

**Type**: A records (IPv4 addresses)
**Value**: The IP addresses provided by Azure (usually 4 addresses)

**Example DNS Records**:
```
Type: A
Name: @
Value: 20.109.xxx.xxx (Azure will provide actual IPs)
TTL: 3600
```

**Note**: Apex domains require verification. Azure will provide a TXT record to verify domain ownership.

#### Option B: Using Subdomain (e.g., `expenses.bigsixautosales.com`) - Recommended

**Type**: CNAME record
**Name**: `expenses` (or your subdomain)
**Value**: `icy-mud-054593f0f.3.azurestaticapps.net` (your current Static Web App hostname)
**TTL**: 3600 (or default)

**Example DNS Record**:
```
Type: CNAME
Name: expenses
Value: icy-mud-054593f0f.3.azurestaticapps.net
TTL: 3600
```

### Step 3: Verify Domain Ownership

1. Azure will show you a **TXT record** to add to your DNS
2. Add this TXT record to your domain provider:
   ```
   Type: TXT
   Name: @ (or _dnsauth.expenses for subdomain)
   Value: (Azure provides this - looks like: "asuid-...")
   TTL: 3600
   ```
3. Wait for DNS propagation (can take 5-30 minutes)
4. Click **Validate** in Azure Portal

### Step 4: SSL Certificate

Azure Static Web Apps automatically provides a **free SSL certificate** (managed by Azure):
- SSL certificate is automatically provisioned
- Automatic renewal
- HTTPS is enabled automatically
- No additional cost

### Step 5: Update Frontend Configuration

After your custom domain is active, you'll need to update:

#### Update Backend CORS Settings

1. **Azure Portal** → Your App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Configuration** → **Application settings**
3. Update `FRONTEND_URL` to your custom domain:
   - Old: `https://icy-mud-054593f0f.3.azurestaticapps.net`
   - New: `https://your-custom-domain.com`
4. Click **Save**
5. **Overview** → **Restart** the App Service

#### Update Workflow Environment Variable (Optional)

If you want to keep the build process consistent, you can also update the workflow:

1. Edit `.github/workflows/azure-static-web-apps-icy-mud-054593f0f.yml`
2. Update `VITE_API_URL` in the `env` section to match your backend (if needed)
3. The frontend will still use the correct API URL from environment variables

**Note**: The backend API URL doesn't change - it's still `https://expenses-tracker-backend-b4cxc0etfnaabqb9.centralus-01.azurewebsites.net/api`

### Step 6: Test Your Custom Domain

1. Wait for DNS propagation (5-30 minutes)
2. Visit your custom domain: `https://your-custom-domain.com`
3. Verify it loads your app
4. Test login/signup to ensure API calls work

## DNS Configuration Examples

### Example 1: Subdomain (Recommended)

**Domain Provider**: GoDaddy, Namecheap, etc.

**DNS Records to Add**:
```
Type: CNAME
Name: expenses
Value: icy-mud-054593f0f.3.azurestaticapps.net
TTL: 3600

Type: TXT (for verification)
Name: _dnsauth.expenses
Value: asuid-xxxxx... (provided by Azure)
TTL: 3600
```

**Result**: Your app will be accessible at `https://expenses.yourdomain.com`

### Example 2: Apex Domain

**DNS Records to Add**:
```
Type: A
Name: @
Value: 20.109.xxx.xxx (4 IP addresses from Azure)
TTL: 3600

Type: TXT (for verification)
Name: @
Value: asuid-xxxxx... (provided by Azure)
TTL: 3600
```

**Result**: Your app will be accessible at `https://yourdomain.com`

## Troubleshooting

### Domain Validation Fails

1. **Check DNS Records**: Verify TXT record is added correctly
2. **Wait for Propagation**: DNS changes can take up to 48 hours (usually 5-30 min)
3. **Check DNS**: Use online DNS checker: `https://dnschecker.org`
4. **Remove Special Characters**: Some DNS providers have issues with underscores in TXT records

### SSL Certificate Not Provisioning

1. **Wait**: SSL certificates take 10-30 minutes to provision
2. **Check Domain Status**: Azure Portal → Custom domains → Check status
3. **Re-validate**: Click "Validate" again after DNS propagates

### CORS Errors After Domain Change

1. **Update FRONTEND_URL** in App Service configuration
2. **Restart App Service** after updating
3. **Clear browser cache** and test again

### Custom Domain Not Working

1. **Verify DNS Records**: Use `dig` or `nslookup` to check DNS
2. **Check Azure Portal**: Custom domains → Check status/errors
3. **Verify SSL Certificate**: Should show "Ready" status
4. **Test**: Try accessing via HTTP first (should redirect to HTTPS)

## Quick Checklist

- [ ] Custom domain added in Azure Portal
- [ ] DNS records (CNAME or A records) added to domain provider
- [ ] TXT verification record added
- [ ] Domain validated in Azure Portal
- [ ] SSL certificate provisioned (automatic)
- [ ] `FRONTEND_URL` updated in App Service configuration
- [ ] App Service restarted after config change
- [ ] Custom domain tested and working

## Cost

✅ **Free**: Custom domains and SSL certificates are **free** with Azure Static Web Apps (Standard plan features included in many tiers)

## After Setup

Once your custom domain is working:

1. Your app will be accessible at your custom domain
2. The old URL (`icy-mud-054593f0f.3.azurestaticapps.net`) will still work as a redirect
3. All traffic automatically uses HTTPS (SSL)
4. No code changes needed - everything continues to work

---

## Need Help?

If you need specific help with your domain provider (GoDaddy, Namecheap, Cloudflare, etc.), share which provider you're using and I can provide more detailed steps.

