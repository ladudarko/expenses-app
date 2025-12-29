import express, { Response } from 'express';
import { pool } from '../config/database.js';
import { requireAdmin, AdminRequest } from '../middleware/adminAuth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', requireAdmin, async (req: AdminRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, username, business_name, is_admin, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all expenses across all users (admin only)
router.get('/expenses', requireAdmin, async (req: AdminRequest, res: Response) => {
  try {
    const { user_id, business_name } = req.query;

    let query = `
      SELECT 
        e.*,
        u.username,
        u.business_name
      FROM expenses e
      JOIN users u ON e.user_id = u.id
    `;
    const params: any[] = [];

    if (user_id) {
      query += ' WHERE e.user_id = $1';
      params.push(user_id);
    } else if (business_name) {
      query += ' WHERE u.business_name ILIKE $1';
      params.push(`%${business_name}%`);
    }

    query += ' ORDER BY e.date DESC, e.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expense summary by business (admin only)
router.get('/summary', requireAdmin, async (req: AdminRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.business_name,
        u.username,
        COUNT(e.id) as expense_count,
        SUM(e.amount) as total_amount,
        MIN(e.date) as first_expense_date,
        MAX(e.date) as last_expense_date
      FROM users u
      LEFT JOIN expenses e ON u.id = e.user_id
      GROUP BY u.id, u.business_name, u.username
      ORDER BY total_amount DESC NULLS LAST
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expenses by category across all businesses (admin only)
router.get('/expenses/by-category', requireAdmin, async (req: AdminRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.category,
        COUNT(e.id) as expense_count,
        SUM(e.amount) as total_amount,
        AVG(e.amount) as avg_amount
      FROM expenses e
      GROUP BY e.category
      ORDER BY total_amount DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching category summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Make user admin (super admin only - for initial setup)
router.post('/users/:id/make-admin', requireAdmin, async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE users SET is_admin = true WHERE id = $1 RETURNING id, username, is_admin',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User granted admin privileges', user: result.rows[0] });
  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', requireAdmin, async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const adminUserId = req.userId;
    
    // Prevent admin from deleting themselves
    if (Number(id) === adminUserId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    // Check if user exists
    const userCheck = await pool.query('SELECT id, is_admin FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete user (cascade will delete expenses)
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username', [id]);

    res.json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
