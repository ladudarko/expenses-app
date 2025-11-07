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

## Usage

1. **Register**: Create an account with your username and password
2. **Login**: Sign in with your username and password
3. **Add Expenses**: Use the form to add new expenses
4. **View Expenses**: All expenses are displayed in a table
5. **Filter**: Use the advanced filters to narrow by type, project, category, vendor, date, or amount
6. **Export**: Click "Export CSV for Accountant" to download a CSV file (respects current filters)
7. **Summary**: View category-wise and project-wise summaries with visual progress bars
8. **Logout**: Click logout button when done

## Project Structure

```
expenses-app/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── services/           # API service layer
│   ├── types.ts           # TypeScript types
│   └── utils/             # Utility functions
├── server/                # Backend Express server
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/        # API routes
│   │   └── types.ts       # TypeScript types
│   └── package.json
├── package.json           # Frontend dependencies
└── README.md

```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Expenses
- `GET /api/expenses` - Get all expenses (with optional category filter)
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary/categories` - Get category summary

## Data Storage

All expenses are stored in a JSON file at `server/data/db.json`. Your data persists across sessions and is isolated per user account.

**Note**: For production use, consider upgrading to PostgreSQL for better performance and data integrity.

**Security Features:**
- Password hashing with bcrypt
- JWT-based authentication
- Per-user data isolation
- No database credentials needed

## Export Format

The exported CSV includes:
- Date (MM/DD/YYYY format)
- Type (Business or Personal)
- Category
- Description
- Vendor
- Project
- Amount

## Production Deployment

For production deployment:

1. **Set strong JWT_SECRET**: Generate a secure random string
2. **Use environment variables**: Configure production database credentials
3. **Enable HTTPS**: Use SSL certificates for secure communication
4. **Build frontend**: Run `npm run build` and serve the `dist` folder
5. **Deploy backend**: Use PM2 or similar process manager
6. **Set up database**: Use managed PostgreSQL service (AWS RDS, etc.)

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- date-fns

**Backend:**
- Node.js
- Express
- TypeScript
- JSON file-based database
- JWT (jsonwebtoken)
- bcrypt
- CORS

## License

© 2024 BigSix AutoSales LLC. All rights reserved.
