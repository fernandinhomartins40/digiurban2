
import pool from './db';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  console.log('🔄 Initializing database...');
  
  try {
    // Test database connection first
    const client = await pool.connect();
    console.log('✅ Database connection established');
    client.release();
    
    // Read and execute schema files in order
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
        
        // Split by semicolon and execute each statement separately
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
        
        for (const statement of statements) {
          if (statement.trim()) {
            await pool.query(statement.trim());
          }
        }
        
        console.log(`✅ ${file} executed successfully`);
      } else {
        console.log(`⚠️  ${file} not found, skipping...`);
      }
    }
    
    // Insert sample users if not exists
    console.log('📄 Inserting sample users...');
    await pool.query(`
      INSERT INTO users (name, email, role) 
      VALUES ('Admin User', 'admin@example.com', 'admin'),
             ('Test User', 'user@example.com', 'user'),
             ('Chat User', 'chat@example.com', 'user')
      ON CONFLICT (email) DO NOTHING
    `);
    
    // Add admin user to all chat rooms as moderator
    console.log('📄 Setting up chat participants...');
    await pool.query(`
      INSERT INTO chat_participants (room_id, user_id, role)
      SELECT cr.id, u.id, 'moderator'
      FROM chat_rooms cr, users u 
      WHERE u.email = 'admin@example.com'
      ON CONFLICT (room_id, user_id) DO NOTHING
    `);
    
    console.log('✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

export default initializeDatabase;
