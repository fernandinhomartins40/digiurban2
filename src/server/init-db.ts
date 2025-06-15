
import pool from './db';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  console.log('🔄 Initializing database...');
  
  try {
    // Read and execute schema files
    const schemaFiles = [
      'schema.sql',
      'chat-schema.sql', 
      'alert-schema.sql'
    ];
    
    for (const file of schemaFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`📄 Executing ${file}...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await pool.query(sql);
        console.log(`✅ ${file} executed successfully`);
      } else {
        console.log(`⚠️  ${file} not found, skipping...`);
      }
    }
    
    // Insert sample user if not exists
    await pool.query(`
      INSERT INTO users (name, email, role) 
      VALUES ('Admin User', 'admin@example.com', 'admin'),
             ('Test User', 'user@example.com', 'user')
      ON CONFLICT (email) DO NOTHING
    `);
    
    console.log('✅ Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default initializeDatabase;
