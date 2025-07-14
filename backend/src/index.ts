import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import healthRouter from './routes/health.js';
import alertsRouter from './routes/alerts.js';
import chatRouter from './routes/chat.js';
import usersRouter from './routes/users.js';

// Import database
import { pool, initializeDatabase } from './database/db.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/users', usersRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 DigiUrban API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      '/api/health',
      '/api/alerts',
      '/api/chat',
      '/api/users'
    ]
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err);
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database initialization and server startup
async function startServer() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 DigiUrban Backend Server running on port ${port}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      console.log(`🔗 Health check: http://localhost:${port}/api/health`);
      console.log(`👥 Users API: http://localhost:${port}/api/users`);
      console.log(`💬 Chat API: http://localhost:${port}/api/chat/rooms`);
      console.log(`📢 Alerts API: http://localhost:${port}/api/alerts/categories`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('📴 HTTP server closed');
        
        try {
          await pool.end();
          console.log('📴 Database pool closed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during database shutdown:', error);
          process.exit(1);
        }
      });

      // Force close after 30 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 