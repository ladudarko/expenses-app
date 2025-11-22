# BigSix AutoSales LLC - Business Expense Tracker

A modern full-stack web application for tracking auto business expenses with database storage and export functionality for accountants.

## Features

- ✅ **User Authentication**: Secure login/register with JWT tokens
- ✅ **Easy Expense Entry**: Add expenses with date, category, description, vendor, and amount
- 🧾 **Expense Labeling**: Separate personal vs business expenses and group by project
- 📊 **Category Tracking**: 13 predefined categories for common auto business expenses
- 🗄️ **Database Storage**: JSON file-based database (can be upgraded to PostgreSQL)
- 🔍 **Filter by Category**: View expenses by specific category
- 📈 **Summary Dashboard**: Visual breakdown of expenses by category
- 📥 **CSV Export**: Generate accountant-ready CSV reports
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔒 **Secure**: Each user has their own isolated expense data
- 🛡️ **Admin Dashboard**: Admin users can view all businesses' expenses

## Expense Categories

- Vehicle Purchase
- Vehicle Maintenance
- Parts & Supplies
- Fuel
- Insurance
- Licensing & Registration
- Office Supplies
- Marketing & Advertising
- Professional Services
- Utilities
- Rent
- Software & Subscriptions
- Other

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**

## Getting Started

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables

**Backend** (in `server/` directory):

The `.env` file is already created with default settings. Edit `server/.env` if needed:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=bigsix_secret_key_change_in_production_12345
FRONTEND_URL=http://localhost:5173
```

**Frontend** (in root directory):

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start the Development Servers

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Backend will be available at `http://localhost:3000`

**Terminal 2 - Frontend:**

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Default Users

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Admin dashboard (system-wide view)

### Regular User (Leo)
- **Username**: `leo`
- **Password**: `Summer12!`
- **Access**: Regular expense tracker (own business only)

## Documentation

All documentation files are located in the `README/` folder:

- **SETUP.md** - Detailed setup instructions
- **ARCHITECTURE.md** - Technical architecture overview
- **DEPLOYMENT.md** - Azure deployment guide
- **ADMIN_SETUP_GUIDE.md** - Admin dashboard setup
- **ACCESS_DATABASE.md** - How to access and edit the database
- And many more troubleshooting and setup guides...

## Technology Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: JSON file-based (production-ready for PostgreSQL)
- **Authentication**: JWT tokens
- **Deployment**: Azure Static Web Apps (frontend) + Azure App Service (backend)

## Project Structure

```
expenses-app/
├── src/                    # Frontend React application
│   ├── components/        # React components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── server/                # Backend Express application
│   ├── src/              # TypeScript source
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth middleware
│   │   └── config/       # Database config
│   └── data/             # JSON database files
└── README/               # All documentation files
```

## License

© 2025 BigSix AutoSales LLC. All rights reserved.
