
// HOW TO RUN THE BACKEND LOCALLY
// 1. Set up your environment variables (see .env.example).
// 2. Start your PostgreSQL instance and ensure DATABASE_URL is correct.
// 3. Run the backend:   npm run dev:server   (requires ts-node)
// 4. For fullstack development, use:   npm run dev   (requires concurrently)
// The frontend will run on :8080 and API requests will proxy to :3000

import express from 'express';
import cors from 'cors';
import path from 'path';
import pool from './db';
import initializeDatabase from './init-db';
import usersRouter from './api/users';
import chatRoutes from './api/chat';
import alertRoutes from './api/alerts';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3003;

app.use(cors());
app.use(express.json());

// Serve static files from public directory (frontend build)
app.use(express.static(path.join(__dirname, 'public')));

// Test database connection and initialize
async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    
    // Initialize database schema
    await initializeDatabase();
    console.log('✅ Database schema initialized');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('Please check your DATABASE_URL in .env file');
    console.error('Make sure PostgreSQL is running and accessible');
    process.exit(1);
  }
}

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/chat', chatRoutes);
app.use('/api/alerts', alertRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW() as timestamp, version() as version');
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        timestamp: result.rows[0].timestamp,
        version: result.rows[0].version.split(' ')[0] // Just the version number
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

// Catch-all handler: serve index.html for all non-API routes (SPA support)
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  
  // Serve index.html for all other routes
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
async function startServer() {
  try {
    await setupDatabase();
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🔗 Health check: http://localhost:${port}/api/health`);
      console.log(`💬 Chat API: http://localhost:${port}/api/chat/rooms`);
      console.log('✅ Chat system ready!');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Gracefully shutting down...');
  await pool.end();
  console.log('✅ Database connections closed');
  process.exit(0);
});

startServer();
