# Where to Find TXT Record in Azure Portal

## Step-by-Step: Finding the TXT Record

### Step 1: Add Custom Domain (if not already done)

1. **Azure Portal** → Your Static Web App: `expenses-app`
2. Click **Custom domains** in the left menu
3. Click **+ Add** button
4. Choose:
   - **Type**: Production domain (recommended)
   - **Domain**: `expenses.big6cloud.com` (or your domain)
5. Click **Next**

### Step 2: Azure Shows DNS Records

After clicking "Next", Azure will display a screen showing **exactly what DNS records you need to add**.

You'll see:

#### For Subdomain (CNAME):
```
Type: CNAME
Name: expenses
Value: icy-mud-054593f0f.3.azurestaticapps.net

Type: TXT
Name: _dnsauth.expenses
Value: asuid-xxxxx-xxxxx-xxxxx... (this is what you need!)
```

#### For Apex Domain (A records):
```
Type: A
Name: @
Value: 20.109.xxx.xxx (IP address 1)
Value: 20.109.xxx.xxx (IP address 2)
Value: 20.109.xxx.xxx (IP address 3)
Value: 20.109.xxx.xxx (IP address 4)

Type: TXT
Name: @
Value: asuid-xxxxx-xxxxx-xxxxx... (this is what you need!)
```

### Step 3: Copy the TXT Record Value

The TXT record value will look something like:
```
asuid-abc123def456ghi789jkl012
```

**Copy this entire value** - you'll paste it into Cloudflare.

---

## If You Already Added the Domain

If you already added the domain and need to see the TXT record again:

### Option 1: Check Domain Status

1. **Azure Portal** → Static Web App: `expenses-app`
2. Click **Custom domains**
3. Find your domain in the list
4. Click on it to see details
5. Look for **"Domain verification"** or **"DNS records"** section

### Option 2: Remove and Re-add (if needed)

If you can't find the TXT record:
1. Remove the domain from Azure Portal
2. Add it again - Azure will show the TXT record on the setup screen
3. Copy it before proceeding

---

## Visual Guide

When you're on the "Add custom domain" screen in Azure Portal, you'll see something like:

```
┌─────────────────────────────────────────┐
│ Add custom domain                       │
├─────────────────────────────────────────┤
│ Domain: expenses.big6cloud.com          │
│                                         │
│ DNS Configuration                       │
│                                         │
│ Add the following DNS records:          │
│                                         │
│ 1. CNAME Record                         │
│    Name: expenses                       │
│    Value: icy-mud-054593f0f.3...       │
│                                         │
│ 2. TXT Record (for verification)        │
│    Name: _dnsauth.expenses              │
│    Value: asuid-xxxxxxxxxxxxx           │ ← THIS IS WHAT YOU NEED
│                                         │
│ [Cancel] [Next]                         │
└─────────────────────────────────────────┘
```

---

## After You Add DNS Records in Cloudflare

1. Go back to Azure Portal → Custom domains
2. Click **"Validate"** button next to your domain
3. Azure will check if the DNS records are correct
4. Wait for validation (can take 10-30 minutes)

---

## Quick Checklist

- [ ] Azure Portal → Static Web App → Custom domains
- [ ] Click "+ Add" to add your domain
- [ ] Azure shows DNS records needed (including TXT record)
- [ ] **Copy the TXT record value** (starts with `asuid-...`)
- [ ] Add TXT record in Cloudflare with the copied value
- [ ] Click "Validate" in Azure Portal after DNS is added
- [ ] Wait for validation to complete

---

**The TXT record value is shown on the same screen where Azure asks you to add DNS records - it's part of the domain setup wizard.**

