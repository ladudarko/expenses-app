import express, { Response } from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { Expense } from '../types.js';

const router = express.Router();

// Get all expenses for the authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { category } = req.query;

    let query = 'SELECT * FROM expenses WHERE user_id = $1';
    const params: any[] = [userId];

    if (category) {
      query += ' AND category = $2';
      params.push(category);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single expense by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new expense
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
      const { date, category, description, vendor, amount, currency, expense_type, project_name }: Expense = req.body;

      if (!date || !category || !description || !amount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(
        'INSERT INTO expenses (user_id, date, category, description, vendor, amount, currency, expense_type, project_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [userId, date, category, description, vendor || null, amount, currency || 'USD', expense_type || 'Business', project_name || null]
      );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update expense
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
      const { date, category, description, vendor, amount, currency, expense_type, project_name }: Expense = req.body;

      // Check if expense exists and belongs to user
      const checkResult = await pool.query(
        'SELECT id FROM expenses WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      const result = await pool.query(
        'UPDATE expenses SET date = $1, category = $2, description = $3, vendor = $4, amount = $5, currency = $6, expense_type = $7, project_name = $8 WHERE id = $9 AND user_id = $10 RETURNING *',
        [date, category, description, vendor || null, amount, currency || 'USD', expense_type || 'Business', project_name || null, id, userId]
      );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get summary by category
router.get('/summary/categories', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      'SELECT category, SUM(amount) as total FROM expenses WHERE user_id = $1 GROUP BY category ORDER BY total DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

