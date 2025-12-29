import bcrypt from 'bcrypt';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In production, the script is in dist/scripts/, so data is at dist/../../data/db.json = data/db.json
// In development, it's at ../data/db.json
// Try production path first, then fallback to development path
const prodDbPath = path.join(__dirname, '../../data/db.json');
const devDbPath = path.join(__dirname, '../data/db.json');
const dbPath = existsSync(prodDbPath) ? prodDbPath : devDbPath;

// Get username and password from command line arguments
const username = process.argv[2];
const newPassword = process.argv[3] || 'password123';

async function resetUserPassword() {
  try {
    if (!username) {
      console.log('Usage: node reset-user-password.js <username> [new-password]');
      console.log('Example: node reset-user-password.js admin mynewpassword');
      console.log('Example: node reset-user-password.js leo (uses default password: password123)');
      process.exit(1);
    }
    
    // Read database
    const db = JSON.parse(readFileSync(dbPath, 'utf8'));
    
    // Find user by username
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      console.log(`❌ User "${username}" not found`);
      console.log('\nAvailable users:');
      db.users.forEach(u => {
        console.log(`  - ${u.username}${u.is_admin ? ' (admin)' : ''}`);
      });
      process.exit(1);
    }
    
    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    user.password_hash = passwordHash;
    user.updated_at = new Date().toISOString();
    
    // Save database
    writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    console.log('✅ Password reset successfully!');
    console.log(`Username: ${user.username}`);
    console.log(`New Password: ${newPassword}`);
    if (user.is_admin) {
      console.log('(Admin user)');
    }
    console.log('\n⚠️  Please change this password after logging in!');
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
}

resetUserPassword();

