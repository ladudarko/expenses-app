# Add Custom Domain to Azure Static Web Apps (Cloudflare)

## Your Domain
- **Domain**: `big6cloud.com`
- **DNS Provider**: Cloudflare
- **Current Azure URL**: `https://icy-mud-054593f0f.3.azurestaticapps.net`

## Recommended Setup

You have two options:

### Option 1: Subdomain (Recommended) - `expenses.big6cloud.com`
- Easier to set up
- Allows you to use the apex domain for other purposes
- Better for future expansion

### Option 2: Apex Domain - `big6cloud.com`
- Your main domain points directly to the app
- Requires A records and may conflict with other services

I'll provide instructions for both, but **subdomain is recommended**.

---

## Setup Steps for Cloudflare

### Step 1: Add Custom Domain in Azure Portal

1. **Azure Portal** → Static Web App: `expenses-app`
2. Click **Custom domains** in left menu
3. Click **+ Add** button
4. Enter your domain:
   - **Option A (Recommended)**: `expenses.big6cloud.com`
   - **Option B**: `big6cloud.com` (apex domain)
5. Click **Next**
6. Azure will show you the DNS records to add - **note these down**

---

### Step 2: Configure DNS in Cloudflare

#### For Subdomain: `expenses.big6cloud.com` (Recommended)

1. **Login to Cloudflare** → Select `big6cloud.com` domain
2. Go to **DNS** → **Records**
3. Click **Add record**

**Add CNAME Record**:
- **Type**: `CNAME`
- **Name**: `expenses`
- **Target**: `icy-mud-054593f0f.3.azurestaticapps.net`
- **Proxy status**: ⚠️ **Turn OFF proxy** (gray cloud, not orange) - Important!
- **TTL**: `Auto` or `1 hour`
- Click **Save**

**Add TXT Record for Verification**:
- **Type**: `TXT`
- **Name**: `_dnsauth.expenses`
- **Content**: (Azure will provide this - starts with `asuid-...`)
- **TTL**: `Auto`
- **Proxy status**: Gray cloud (DNS only)
- Click **Save**

#### For Apex Domain: `big6cloud.com`

**Important**: Cloudflare requires using **Proxied A records** differently. For Azure Static Web Apps with apex domains, you might need to:

1. **Turn off Cloudflare Proxy** (temporarily) for A records:
   - Go to Cloudflare → DNS → Records
   - Add A records with **gray cloud** (DNS only, not proxied)

2. **Add A Records** (Azure will provide 4 IP addresses):
   - **Type**: `A`
   - **Name**: `@` (or `big6cloud.com`)
   - **IPv4 address**: `20.109.xxx.xxx` (first IP from Azure)
   - **Proxy status**: ⚠️ **Gray cloud** (DNS only, not proxied)
   - **TTL**: `Auto`
   - Click **Save**
   - Repeat for all 4 IP addresses Azure provides

3. **Add TXT Record for Verification**:
   - **Type**: `TXT`
   - **Name**: `@`
   - **Content**: (Azure provides this - starts with `asuid-...`)
   - **TTL**: `Auto`
   - **Proxy status**: Gray cloud
   - Click **Save**

---

## Important: Cloudflare Proxy Settings

⚠️ **CRITICAL**: For Azure Static Web Apps to work properly:

### For CNAME Records (Subdomain):
- **Proxy status**: **Gray cloud** (DNS only) ✅
- **NOT**: Orange cloud (proxied) ❌

**Why?** Cloudflare proxy can interfere with Azure's SSL certificate provisioning and domain validation.

### How to Set Gray Cloud:
1. In Cloudflare DNS records, look for the cloud icon next to your record
2. Click it to toggle:
   - **Gray cloud** = DNS only (correct)
   - **Orange cloud** = Proxied (turn off)

---

## Step 3: Verify Domain in Azure Portal

1. After adding DNS records in Cloudflare, wait 5-10 minutes
2. **Azure Portal** → Static Web App → **Custom domains**
3. Click **Validate** button next to your domain
4. Azure will check DNS records
5. Wait for validation (can take 10-30 minutes)

**Check DNS Propagation**:
- Use: `https://dnschecker.org`
- Check for your CNAME or A records
- Make sure they're visible globally

---

## Step 4: Wait for SSL Certificate

Azure automatically provisions a **free SSL certificate**:
- Usually takes 10-30 minutes
- Status will show in Azure Portal → Custom domains
- You'll see "Ready" status when complete

---

## Step 5: Update Backend CORS Configuration

**After your custom domain is active and working**:

1. **Azure Portal** → App Service: `expenses-tracker-backend-b4cxc0etfnaabqb9`
2. **Configuration** → **Application settings**
3. Update `FRONTEND_URL`:
   - **If using subdomain**: `https://expenses.big6cloud.com`
   - **If using apex**: `https://big6cloud.com`
4. Click **Save**
5. **Overview** → Click **Restart** button
6. Wait 1-2 minutes for restart

**This is critical** - otherwise you'll get CORS errors!

---

## Step 6: Update Workflow (Optional)

If you want to keep everything consistent, you can update the workflow to reflect the new domain name (though it's not strictly necessary):

The workflow will continue to work with the old URL in environment variables, but for clarity, you could update:

`.github/workflows/azure-static-web-apps-icy-mud-054593f0f.yml`

But this is **optional** - the app will work fine with the old environment variable.

---

## Cloudflare-Specific Tips

### If DNS Changes Don't Show Up

1. **Purge Cloudflare Cache**:
   - Cloudflare Dashboard → Caching → Configuration
   - Click **Purge Everything**

2. **Check Cloudflare Status**:
   - Make sure records show "DNS only" (gray cloud)
   - Proxied records (orange cloud) can cause issues

3. **Verify DNS Propagation**:
   - Use `dig` or online tools:
     ```bash
     dig expenses.big6cloud.com
     # Should show CNAME to icy-mud-054593f0f.3.azurestaticapps.net
     ```

### Cloudflare Proxy Issues

If you're having trouble:

1. **Temporarily disable Cloudflare proxy** (gray cloud) for Azure records
2. **Set SSL/TLS mode** to "Full" (not "Flexible") in Cloudflare:
   - Cloudflare → SSL/TLS → Overview
   - Set to "Full" mode
3. After Azure SSL is provisioned, you can enable proxy again if desired

---

## Quick Checklist

- [ ] Custom domain added in Azure Portal
- [ ] CNAME record added in Cloudflare (subdomain) or A records (apex)
- [ ] **Proxy turned OFF** (gray cloud) for Azure records
- [ ] TXT verification record added in Cloudflare
- [ ] DNS records verified (use dnschecker.org)
- [ ] Domain validated in Azure Portal
- [ ] SSL certificate provisioned (automatic, wait 10-30 min)
- [ ] `FRONTEND_URL` updated in App Service configuration
- [ ] App Service restarted after config change
- [ ] Custom domain tested in browser

---

## Expected Timeline

1. **DNS Records Added**: Immediate (in Cloudflare)
2. **DNS Propagation**: 5-30 minutes (sometimes up to 1 hour)
3. **Domain Validation**: 10-30 minutes after DNS propagates
4. **SSL Certificate**: 10-30 minutes after validation
5. **Total**: Usually **30-60 minutes** from start to finish

---

## Troubleshooting

### "Domain validation failed"

1. **Check DNS Records**:
   - Verify CNAME/TXT records are correct in Cloudflare
   - Check propagation: `https://dnschecker.org`
   - Make sure proxy is OFF (gray cloud)

2. **TXT Record Issues**:
   - Some Cloudflare dashboards require quotes around TXT content
   - Try with and without quotes
   - Verify the exact value Azure provides

3. **Wait Longer**:
   - DNS can take up to 48 hours to propagate globally
   - Usually it's much faster (5-30 min)

### SSL Certificate Not Provisioning

1. **Wait**: Can take up to 30 minutes
2. **Check Domain Status**: Azure Portal → Custom domains
3. **Verify DNS**: Make sure CNAME/A records are correct
4. **Check for Errors**: Azure Portal will show error messages

### CORS Errors After Domain Setup

1. **Update FRONTEND_URL** in App Service configuration
2. **Restart App Service** after updating
3. **Clear browser cache** and test again

---

## After Setup

Once your custom domain is working:

- ✅ Your app will be at: `https://expenses.big6cloud.com` (or `https://big6cloud.com`)
- ✅ Old URL still works but redirects to custom domain
- ✅ Free SSL certificate (automatic HTTPS)
- ✅ All features continue to work normally

---

## Quick Reference

**Cloudflare DNS Records Needed** (for subdomain):
```
Type: CNAME
Name: expenses
Target: icy-mud-054593f0f.3.azurestaticapps.net
Proxy: OFF (gray cloud)

Type: TXT
Name: _dnsauth.expenses
Content: (provided by Azure)
Proxy: OFF (gray cloud)
```

**App Service Configuration** (after domain is active):
```
FRONTEND_URL = https://expenses.big6cloud.com
```

Let me know which option you prefer (subdomain or apex) and I can provide more specific guidance!

