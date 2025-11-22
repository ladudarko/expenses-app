# Architecture Overview

## System Architecture

The BigSix AutoSales Expense Tracker is a full-stack application consisting of a React frontend and a Node.js/Express backend with PostgreSQL database.

## Tech Stack

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **date-fns**: Date formatting library

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **PostgreSQL**: Relational database
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing

## Database Schema

```
users
├── id (SERIAL PRIMARY KEY)
├── username (VARCHAR UNIQUE)
├── password_hash (VARCHAR)
├── business_name (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

expenses
├── id (SERIAL PRIMARY KEY)
├── user_id (INTEGER → users.id)
├── date (DATE)
├── category (VARCHAR)
├── description (VARCHAR)
├── vendor (VARCHAR)
├── amount (DECIMAL)
├── expense_type (VARCHAR)
├── project_name (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## API Architecture

### Authentication Flow

1. User registers/logs in
2. Server validates credentials
3. Server generates JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header for subsequent requests

### Request Flow

```
Frontend → API Service → Auth Middleware → Route Handler → Database → Response
```

### Security

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based auth
- **Data Isolation**: Each user only sees their own data
- **SQL Injection Protection**: Parameterized queries
- **CORS**: Configured for frontend origin only

## File Structure

```
├── src/                    # Frontend source
│   ├── components/         # React components
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── SummaryCard.tsx
│   │   └── Login.tsx
│   ├── services/           # API integration
│   │   └── api.ts
│   ├── types.ts           # TypeScript types
│   ├── utils/             # Utilities
│   │   ├── export.ts
│   │   └── storage.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
│
├── server/                # Backend source
│   ├── src/
│   │   ├── config/        # Configuration
│   │   │   ├── database.ts
│   │   │   └── schema.sql
│   │   ├── middleware/    # Middleware
│   │   │   └── auth.ts
│   │   ├── routes/        # API routes
│   │   │   ├── auth.ts
│   │   │   └── expenses.ts
│   │   ├── types.ts       # TypeScript types
│   │   └── index.ts       # Server entry
│   ├── package.json
│   └── .env.example
│
├── package.json           # Frontend package
├── .env.example           # Frontend env template
├── README.md              # Main documentation
├── SETUP.md               # Setup instructions
└── ARCHITECTURE.md        # This file
```

## Key Components

### Frontend Components

**Login**: Authentication UI with register/login forms
**App**: Main application container with routing and state management
**ExpenseForm**: Form for adding new expenses
**ExpenseList**: Table displaying all expenses with filtering
**SummaryCard**: Visual summary by category

**API Service**: Centralized API client with:
- Token management
- Request/response handling
- Error handling

### Backend Components

**Auth Routes**: Registration, login, and user info endpoints
**Expense Routes**: CRUD operations for expenses
**Auth Middleware**: JWT token validation
**Database Config**: PostgreSQL connection pool

## Data Flow

### Adding an Expense

1. User fills out ExpenseForm
2. Form submits to `api.createExpense()`
3. Request sent to `POST /api/expenses` with JWT token
4. Auth middleware validates token
5. Route handler inserts into database
6. Response returns new expense
7. Frontend updates state and re-renders

### Fetching Expenses

1. Component mounts or filter changes
2. Calls `api.getExpenses()`
3. Request sent to `GET /api/expenses`
4. Auth middleware validates token
5. Route handler queries database with user_id filter
6. Response returns expense array
7. Frontend displays in ExpenseList

## Security Considerations

1. **Authentication**: JWT tokens expire after 7 days
2. **Authorization**: All expense endpoints verify user ownership
3. **Password Security**: Bcrypt with 10 salt rounds
4. **SQL Injection**: All queries use parameterized statements
5. **CORS**: Restricted to frontend URL only
6. **Environment Variables**: Sensitive data in .env files

## Scaling Considerations

For production scaling:

1. **Database**: Connection pooling already implemented
2. **Caching**: Could add Redis for frequently accessed data
3. **Load Balancing**: Multiple backend instances behind Nginx
4. **CDN**: Serve static frontend assets
5. **Monitoring**: Add logging and error tracking (Sentry, etc.)
6. **Rate Limiting**: Implement request throttling

## Deployment

Recommended production stack:

- **Frontend**: Static hosting (Netlify, Vercel, S3+CloudFront)
- **Backend**: Node.js hosting (Heroku, AWS EB, DigitalOcean)
- **Database**: Managed PostgreSQL (AWS RDS, Heroku Postgres)
- **Process Manager**: PM2 for Node.js
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt certificates

