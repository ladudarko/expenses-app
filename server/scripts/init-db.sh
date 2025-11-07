#!/bin/bash

# Database initialization script for BigSix AutoSales Expense Tracker
# Usage: ./init-db.sh [database_name] [username] [password]

DB_NAME=${1:-bigsix_expenses}
DB_USER=${2:-postgres}
DB_PASSWORD=${3:-}

echo "Initializing database: $DB_NAME"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Create database
echo "Creating database..."
createdb -U $DB_USER $DB_NAME 2>/dev/null || echo "Database might already exist"

# Run schema
echo "Creating schema..."
if [ -n "$DB_PASSWORD" ]; then
    PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -f src/config/schema.sql
else
    psql -h localhost -U $DB_USER -d $DB_NAME -f src/config/schema.sql
fi

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully!"
    echo "Database: $DB_NAME"
    echo "User: $DB_USER"
else
    echo "❌ Database initialization failed"
    exit 1
fi

