# Admin Dashboard Setup Guide

## What's Been Added

I've created a comprehensive admin system for your expense tracking app:

### 🛡️ Admin Features

1. **Admin Role System**
   - Added `is_admin` field to user model
   - Admin authentication middleware
   - Role-based access control

2. **Admin Dashboard**
   - Overview with key metrics
   - Business summary view
   - All users management
   - Cross-business expense viewing
   - Category analytics

3. **Admin API Endpoints**
   - `GET /api/admin/users` - View all users
   - `GET /api/admin/expenses` - View all expenses (with filters)
   - `GET /api/admin/summary` - Business summary statistics
   - `GET /api/admin/expenses/by-category` - Category breakdown
   - `POST /api/admin/users/:id/make-admin` - Grant admin privileges

### 🔒 Security Features

- **Admin-only access**: Regular users cannot access admin endpoints
- **JWT token validation**: All admin routes require valid authentication
- **Role verification**: Middleware checks `is_admin` flag
- **Data isolation**: Regular users still only see their own data

## How to Create an Admin User

### Method 1: Database Direct Edit (Recommended)

1. **Access database via Kudu console**:
   - Azure Portal → App Service → Advanced Tools (Kudu) → Go
   - Debug console → CMD → `cd site/wwwroot/data`

2. **Edit db.json**:
   - Click on `db.json` → Edit
   - Find your user in the `users` array
   - Add `"is_admin": true` to your user object:

```json
{
  "users": [
    {
      "id": 1,
      "username": "your-username",
      "password_hash": "...",
      "business_name": "BigSix AutoSales LLC",
      "is_admin": true,  ← Add this line
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

3. **Save the file** and restart App Service

### Method 2: Register New Admin User

Since the registration system now includes the `is_admin` field (defaulting to `false`), you can:

1. Register normally
2. Use Method 1 to edit the database and set `is_admin: true`

## Admin Dashboard Features

### 📊 Overview Tab
- **Total Revenue**: Sum of all expenses across all businesses
- **Active Businesses**: Number of registered businesses
- **Total Expenses**: Count of all expense entries
- **Top Categories**: Most expensive categories across all businesses

### 🏢 Businesses Tab
- List of all registered businesses
- Owner information
- Expense counts and totals per business
- Date ranges of activity

### 👥 Users Tab
- All registered users
- Business affiliations
- Admin/User role indicators
- Registration dates

### 💰 All Expenses Tab
- View expenses from all businesses
- Filter by specific business
- Complete expense details
- Cross-business analytics

## User Experience

### For Regular Users
- **No changes**: Regular users see the same interface
- **Data privacy**: Users only see their own expenses
- **Same functionality**: All existing features work unchanged

### For Admin Users
- **Admin dashboard**: Automatically redirected to admin view
- **System overview**: Complete visibility across all businesses
- **Analytics**: Business performance and category insights
- **User management**: View all users and their activity

## Testing the Admin System

1. **Create admin user** (using Method 1 above)
2. **Login with admin credentials**
3. **Verify admin dashboard loads**
4. **Test each tab**:
   - Overview: Check metrics display
   - Businesses: Verify business list
   - Users: Confirm user list shows
   - Expenses: Test expense filtering

5. **Test regular user access**:
   - Login with non-admin account
   - Verify normal expense tracker interface
   - Confirm no admin access

## Security Notes

- ✅ **Admin routes protected**: Require authentication + admin role
- ✅ **Regular user isolation**: Non-admins cannot access other users' data
- ✅ **Token-based security**: All requests validated with JWT
- ✅ **Role verification**: Admin status checked on every admin request

## Deployment

The admin system is included in the current deployment. After the GitHub Actions deployment completes:

1. **Create your admin user** (edit database)
2. **Restart App Service** (to refresh cached data)
3. **Login and test admin dashboard**

---

## Quick Setup Checklist

- [ ] Deploy admin system (GitHub Actions)
- [ ] Edit database to make your user admin (`"is_admin": true`)
- [ ] Restart App Service
- [ ] Login and verify admin dashboard works
- [ ] Test that regular users still work normally

The admin system provides complete oversight while maintaining user privacy and security!
