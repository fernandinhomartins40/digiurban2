import { Router } from 'express';
import { checkDatabaseHealth } from '../database/db.js';

export const healthRouter = Router();

// Basic health check
healthRouter.get('/', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: dbHealth ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };

    if (!dbHealth) {
      return res.status(503).json({
        ...healthStatus,
        status: 'unhealthy',
        error: 'Database connection failed'
      });
    }

    res.json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Detailed health check
healthRouter.get('/detailed', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        database: dbHealth ? 'healthy' : 'unhealthy'
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    const overallHealth = dbHealth ? 'healthy' : 'unhealthy';
    const statusCode = dbHealth ? 200 : 503;

    res.status(statusCode).json({
      ...detailedHealth,
      status: overallHealth
    });
  } catch (error) {
    console.error('Detailed health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed'
    });
  }
}); 