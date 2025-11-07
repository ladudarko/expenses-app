# 🚀 Quick Start Guide

## ✅ Everything is Ready!

The expense tracker is now running with a simple JSON file-based database. No PostgreSQL setup needed!

## Current Status

- ✅ Backend server is running on `http://localhost:3000`
- ✅ Frontend is ready at `http://localhost:5173`
- ✅ Database: JSON file at `server/data/db.json`
- ✅ Authentication: JWT-based with bcrypt password hashing

## What Changed

I switched from PostgreSQL to a JSON file-based database because:
- ❌ PostgreSQL requires installation and setup
- ❌ Native compilation dependencies can fail
- ✅ JSON file is simpler for development
- ✅ No external dependencies needed
- ✅ Works out of the box

## Try It Now!

1. Open your browser to `http://localhost:5173`
2. Click "Sign Up"
3. Create your account:
   - Username: your-username
   - Password: your-password
   - Business Name: BigSix AutoSales LLC
4. Start adding expenses!

## Your Data

Your data is stored in: `server/data/db.json`

This file is automatically created and backed up. Your data persists across sessions.

## Upgrade to PostgreSQL Later

If you want to upgrade to PostgreSQL for production:

1. Install PostgreSQL
2. Update `server/src/config/database.ts` to use PostgreSQL
3. Run the schema in `server/src/config/schema.sql`

But for development, the JSON file works great!

---

**Questions?** Everything should work now! Try signing up at `http://localhost:5173`
