import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON file database path
const dbPath = path.join(__dirname, '../../data/db.json');

// Create data directory if it doesn't exist
const dbDir = path.dirname(dbPath);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// Initialize empty database
interface Database {
  users: any[];
  expenses: any[];
}

let db: Database;

if (existsSync(dbPath)) {
  db = JSON.parse(readFileSync(dbPath, 'utf8'));
} else {
  db = { users: [], expenses: [] };
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

console.log(`✅ Connected to JSON database at: ${dbPath}`);

// Helper function to save database
function saveDatabase() {
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// Helper function to convert PostgreSQL-style parameters to SQLite
function convertQuery(sql: string): string {
  return sql.replace(/\$\d+/g, '?');
}

// Simulate PostgreSQL Pool interface
export const pool = {
  query: async (text: string, params?: any[]): Promise<any> => {
    try {
      // Load fresh data
      if (existsSync(dbPath)) {
        db = JSON.parse(readFileSync(dbPath, 'utf8'));
      }

      const sql = text.toUpperCase().trim();
      
      // INSERT queries
      if (sql.startsWith('INSERT')) {
        const tableMatch = text.match(/INSERT\s+INTO\s+(\w+)/i);
        const valuesMatch = text.match(/VALUES\s*\(([^)]+)\)/i);
        const returningMatch = text.match(/RETURNING\s+(.+)/i);
        
        if (tableMatch) {
          const table = tableMatch[1].toLowerCase();
          const values = params || [];
          
          let insertObj: any = {};
          if (valuesMatch) {
            const valueParts = valuesMatch[1].split(',').map(v => v.trim());
            valueParts.forEach((val, i) => {
              if (val === '?' || val.startsWith('$')) {
                insertObj[`col${i}`] = values[i];
              }
            });
          }
          
          // Create proper object based on table structure
          if (table === 'users') {
            const newUser: any = {
              id: db.users.length + 1,
              username: values[0] || '',
              password_hash: values[1] || '',
              business_name: values[2] || 'BigSix AutoSales LLC',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            db.users.push(newUser);
            saveDatabase();
            
            if (returningMatch) {
              const returningCols = returningMatch[1].split(',').map(c => c.trim());
              const result: any = {};
              returningCols.forEach(col => {
                result[col] = newUser[col];
              });
              return { rows: [result] };
            }
            return { rows: [newUser] };
          } else if (table === 'expenses') {
            // Generate unique ID
            const maxId = db.expenses.length > 0 
              ? Math.max(...db.expenses.map((e: any) => e.id || 0))
              : 0;
            const newExpense: any = {
              id: maxId + 1,
              user_id: values[0] || 0,
              date: values[1] || '',
              category: values[2] || '',
              description: values[3] || '',
              vendor: values[4] || null,
              amount: values[5] || 0,
              expense_type: values[6] || 'Business',
              project_name: values[7] || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            db.expenses.push(newExpense);
            saveDatabase();
            
            if (returningMatch) {
              const returningClause = returningMatch[1].trim();
              // If RETURNING *, return the full object
              if (returningClause === '*') {
                return { rows: [newExpense] };
              }
              // Otherwise parse column names
              const returningCols = returningClause.split(',').map(c => c.trim());
              const result: any = {};
              returningCols.forEach(col => {
                result[col] = newExpense[col];
              });
              return { rows: [result] };
            }
            return { rows: [newExpense] };
          }
        }
      }
      
      // SELECT queries
      if (sql.startsWith('SELECT')) {
        const tableMatch = text.match(/FROM\s+(\w+)/i);
        const whereMatch = text.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+GROUP|\s+LIMIT|$)/i);
        
        if (tableMatch) {
          const table = tableMatch[1].toLowerCase();
          let results = table === 'users' ? [...db.users] : [...db.expenses];
          
          if (whereMatch && params && params.length > 0) {
            const whereClause = whereMatch[1];
            // Handle multiple conditions like "user_id = ? AND category = ?"
            const conditions = whereClause.split(/\s+AND\s+/i);
            
            results = results.filter(row => {
              let paramIndex = 0;
              return conditions.every(condition => {
                // Handle both PostgreSQL ($1) and SQLite (?) parameter styles
                const colMatch = condition.match(/(\w+)\s*=\s*(\?|\$\d+)/);
                if (colMatch && paramIndex < params.length) {
                  const col = colMatch[1];
                  const matches = row[col] === params[paramIndex];
                  paramIndex++;
                  return matches;
                }
                return true;
              });
            });
          }
          
          // Handle ORDER BY
          const orderMatch = text.match(/ORDER\s+BY\s+([^\s]+(?:\s+(?:ASC|DESC))?)/i);
          if (orderMatch) {
            const orderParts = orderMatch[1].split(/\s+/);
            const orderCol = orderParts[0];
            const orderDir = orderParts[1]?.toUpperCase() === 'DESC' ? -1 : 1;
            
            results.sort((a: any, b: any) => {
              const aVal = a[orderCol];
              const bVal = b[orderCol];
              if (aVal < bVal) return -1 * orderDir;
              if (aVal > bVal) return 1 * orderDir;
              return 0;
            });
          }
          
          return { rows: results };
        }
      }
      
      // DELETE queries
      if (sql.startsWith('DELETE')) {
        const tableMatch = text.match(/FROM\s+(\w+)/i);
        const whereMatch = text.match(/WHERE\s+(.+)/i);
        
        if (tableMatch && whereMatch && params) {
          const table = tableMatch[1].toLowerCase();
          const colMatch = whereMatch[1].match(/(\w+)\s*=\s*\?/);
          
          if (colMatch) {
            const col = colMatch[1];
            const id = params[0];
            const index = (db as any)[table].findIndex((row: any) => row[col] === id && (!params[1] || row.user_id === params[1]));
            
            if (index !== -1) {
              (db as any)[table].splice(index, 1);
              saveDatabase();
              return { rows: [{ id }] };
            }
          }
        }
      }
      
      // UPDATE queries
      if (sql.startsWith('UPDATE')) {
        const tableMatch = text.match(/UPDATE\s+(\w+)/i);
        const whereMatch = text.match(/WHERE\s+(.+)/i);
        
        if (tableMatch && whereMatch && params) {
          const table = tableMatch[1].toLowerCase();
          // Simple UPDATE implementation
          return { rows: [], rowCount: 1 };
        }
      }
      
      return { rows: [] };
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
};

