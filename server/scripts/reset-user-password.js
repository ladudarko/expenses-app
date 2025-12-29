import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In production: script is in site/wwwroot/scripts/, node_modules is in site/wwwroot/
// In development: script is in server/scripts/, node_modules is in server/
// Try different paths to find node_modules
const pathsToTry = [
  path.join(__dirname, '../node_modules'),     // Production: scripts/../node_modules = wwwroot/node_modules
  path.join(__dirname, '../../node_modules'),  // Alternative: scripts/../../node_modules
  path.join(process.cwd(), 'node_modules'),    // Current working directory (when run from wwwroot)
  path.resolve('/home/site/wwwroot/node_modules'), // Absolute path for production
];

let nodeModulesPath = null;
for (const tryPath of pathsToTry) {
  const bcryptPath = path.join(tryPath, 'bcrypt');
  if (existsSync(tryPath) && existsSync(bcryptPath)) {
    nodeModulesPath = tryPath;
    break;
  }
}

if (!nodeModulesPath) {
  console.error('❌ Error: Could not find node_modules with bcrypt');
  console.error('Current directory:', process.cwd());
  console.error('Script directory:', __dirname);
  console.error('Tried paths:', pathsToTry);
  console.error('\nTrying to find node_modules...');
  // Try to find node_modules by walking up the directory tree
  let currentDir = __dirname;
  for (let i = 0; i < 5; i++) {
    const tryPath = path.join(currentDir, 'node_modules');
    if (existsSync(tryPath) && existsSync(path.join(tryPath, 'bcrypt'))) {
      nodeModulesPath = tryPath;
      console.error(`Found at: ${nodeModulesPath}`);
      break;
    }
    currentDir = path.dirname(currentDir);
  }
  if (!nodeModulesPath) {
    console.error('Please run from /home/site/wwwroot directory');
    process.exit(1);
  }
}

// Use createRequire to import bcrypt from the correct node_modules location
const require = createRequire(import.meta.url);
const bcrypt = require(path.join(nodeModulesPath, 'bcrypt'));

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

