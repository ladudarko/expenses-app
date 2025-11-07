# Setup Guide for BigSix AutoSales Expense Tracker

This guide will walk you through setting up the application with a PostgreSQL database.

## Quick Start

### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Connect to PostgreSQL (default user is 'postgres')
psql -U postgres

# Create the database
CREATE DATABASE bigsix_expenses;

# Create a user (optional, or use postgres user)
CREATE USER bigsix_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bigsix_expenses TO bigsix_user;

# Exit psql
\q
```

### 3. Run Schema Setup

```bash
psql -U postgres -d bigsix_expenses -f server/src/config/schema.sql
```

### 4. Configure Environment

**Backend Configuration:**

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=bigsix_expenses
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=change_this_to_a_random_secret_key_in_production
FRONTEND_URL=http://localhost:5173
```

**Frontend Configuration:**

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 6. Start the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
📊 BigSix AutoSales LLC Expense Tracker API
✅ Connected to PostgreSQL database
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

You should see:
```
VITE v4.x.x ready in XXX ms
➜ Local: http://localhost:5173/
```

### 7. Access the Application

Open your browser and go to: `http://localhost:5173`

1. Click "Sign Up" to create your first account
2. Enter your username and password
3. Start adding expenses!

## Troubleshooting

### Database Connection Issues

If you get a database connection error:

1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

3. Check credentials in `server/.env`

### Port Already in Use

If port 3000 or 5173 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Kill process on port 5173
lsof -ti:5173 | xargs kill
```

### Module Not Found Errors

Make sure you've installed all dependencies:

```bash
npm install
cd server && npm install && cd ..
```

## Production Deployment

For production, consider:

1. **Database**: Use a managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
2. **Environment Variables**: Set strong JWT_SECRET and secure database credentials
3. **HTTPS**: Configure SSL certificates
4. **Process Manager**: Use PM2 to manage Node.js processes
5. **Reverse Proxy**: Use Nginx for serving static files and proxying API requests

## Need Help?

Check the main README.md for more details on usage and API endpoints.

