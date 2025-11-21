import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/database.js'; // Initialize database
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

dotenv.config();

// Database is initialized in database.ts
console.log('✅ Database ready');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Allow multiple frontend origins (for custom domain support)
const allowedOrigins = FRONTEND_URL.includes(',') 
  ? FRONTEND_URL.split(',').map(url => url.trim())
  : [FRONTEND_URL];

// Also include common Azure Static Web Apps origins as fallback
if (!FRONTEND_URL.includes('localhost')) {
  allowedOrigins.push('https://icy-mud-054593f0f.3.azurestaticapps.net');
}

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - API info
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'BigSix AutoSales Expense Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      expenses: '/api/expenses'
    }
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'BigSix AutoSales API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/admin', (await import('./routes/admin.js')).default);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 BigSix AutoSales LLC Expense Tracker API`);
});

