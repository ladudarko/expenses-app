# Local Testing - Admin Dashboard

## ✅ Setup Complete

I've set up the local environment for testing:

1. **✅ Backend running**: `http://localhost:3000`
   - Database updated with `"is_admin": true` for ladudarko
   - Login endpoint confirmed returning `is_admin: true`

2. **✅ Frontend starting**: Vite dev server
   - Should be available at: `http://localhost:5173`

## Testing Steps

### 1. Open Frontend
Visit: **http://localhost:5173**

### 2. Login as Admin
- **Username**: `ladudarko`
- **Password**: `Summer12!`

### 3. Expected Result
You should automatically see:
- **Purple admin dashboard** (not blue expense tracker)
- **"🛡️ Admin Dashboard"** header
- **Navigation tabs**: Overview, Businesses, Users, Expenses
- **Admin badge** next to username

### 4. Test Admin Features

**Overview Tab**:
- Total revenue across businesses
- Active businesses count
- Top expense categories

**Businesses Tab**:
- List of all registered businesses
- Expense counts and totals

**Users Tab**:
- Should show both users (ladudarko and test)
- Admin/User role indicators

**Expenses Tab**:
- All expenses from all businesses
- Can filter by business

## If Admin Dashboard Doesn't Show

1. **Check browser console** (F12):
   - Look for errors
   - Check if `user.is_admin` is `true`
   - Verify token is stored

2. **Check Network tab**:
   - Login request should return `"is_admin": true`
   - Verify response includes admin field

3. **Hard refresh**: `Ctrl+Shift+R` / `Cmd+Shift+R`

4. **Clear localStorage**:
   - Open DevTools → Application → Local Storage
   - Clear `auth_token`
   - Login again

## Test Regular User

To verify regular users still work:

1. **Logout** from admin account
2. **Login as test** (regular user):
   - Username: `test`
   - Password: `test123` (or whatever you set)
3. **Should see**: Blue expense tracker (NOT admin dashboard)

## Debugging

If admin dashboard still doesn't show, check:

**App.tsx logic** (line 158):
```typescript
if (user?.is_admin) {
  return <AdminDashboard user={user} />;
}
```

This should redirect admin users to the dashboard.

**User object** should have:
```javascript
{
  id: 1,
  username: "ladudarko",
  business_name: "BigSix AutoSales LLC",
  is_admin: true  ← This must be true
}
```

## Current Status

- ✅ Backend running locally on port 3000
- ✅ Database has `is_admin: true` for ladudarko
- ✅ Login returns `is_admin: true`
- ⏳ Frontend starting on port 5173
- ⏳ Ready for local testing

**Test the admin dashboard now!**
