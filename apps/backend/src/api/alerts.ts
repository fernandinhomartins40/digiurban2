import express from 'express';
import pool from '../db';
import { CitizenAlert, AlertCategory, CreateAlertRequest, AlertFilters } from '../types/alerts';
import { AuthenticatedRequest } from '../types/auth';

const router = express.Router();

// Mock authentication middleware - replace with your actual auth implementation
const mockAuth = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  req.user = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };
  next();
};

router.use(mockAuth);

// Get all alert categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM alert_categories WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching alert categories:', error);
    res.status(500).json({ error: 'Failed to fetch alert categories' });
  }
});

// Get alerts with filters and pagination
router.get('/alerts', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      alert_type, 
      category_id, 
      priority, 
      is_active,
      search 
    } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = `
      SELECT 
        ca.*,
        ac.name as category_name,
        ac.color as category_color,
        ac.icon as category_icon,
        u.name as sender_name,
        u.email as sender_email,
        ads.total_recipients,
        ads.delivered_count,
        ads.read_count
      FROM citizen_alerts ca
      LEFT JOIN alert_categories ac ON ca.category_id = ac.id
      LEFT JOIN users u ON ca.sender_id = u.id
      LEFT JOIN alert_delivery_stats ads ON ca.id = ads.alert_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;
    
    if (alert_type) {
      paramCount++;
      query += ` AND ca.alert_type = $${paramCount}`;
      params.push(alert_type);
    }
    
    if (category_id) {
      paramCount++;
      query += ` AND ca.category_id = $${paramCount}`;
      params.push(category_id);
    }
    
    if (priority) {
      paramCount++;
      query += ` AND ca.priority = $${paramCount}`;
      params.push(priority);
    }
    
    if (is_active !== undefined) {
      paramCount++;
      query += ` AND ca.is_active = $${paramCount}`;
      params.push(is_active === 'true');
    }
    
    if (search) {
      paramCount++;
      query += ` AND (ca.title ILIKE $${paramCount} OR ca.message ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY ca.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Transform results
    const alerts = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      message: row.message,
      alert_type: row.alert_type,
      category_id: row.category_id,
      priority: row.priority,
      target_type: row.target_type,
      target_criteria: row.target_criteria,
      sender_id: row.sender_id,
      is_active: row.is_active,
      schedule_at: row.schedule_at,
      expires_at: row.expires_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_name ? {
        name: row.category_name,
        color: row.category_color,
        icon: row.category_icon
      } : null,
      sender: {
        name: row.sender_name,
        email: row.sender_email
      },
      delivery_stats: {
        total_recipients: row.total_recipients || 0,
        delivered_count: row.delivered_count || 0,
        read_count: row.read_count || 0
      }
    }));
    
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create new alert
router.post('/alerts', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const alertData: CreateAlertRequest = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const insertQuery = `
      INSERT INTO citizen_alerts (
        title, message, alert_type, category_id, priority, 
        target_type, target_criteria, sender_id, schedule_at, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [
      alertData.title,
      alertData.message,
      alertData.alert_type,
      alertData.category_id,
      alertData.priority,
      alertData.target_type,
      JSON.stringify(alertData.target_criteria),
      userId,
      alertData.schedule_at,
      alertData.expires_at
    ]);
    
    const newAlert = result.rows[0];
    
    // Initialize delivery stats
    await pool.query(
      'INSERT INTO alert_delivery_stats (alert_id) VALUES ($1)',
      [newAlert.id]
    );
    
    // If target is 'all', create recipients for all users
    if (alertData.target_type === 'all') {
      await pool.query(`
        INSERT INTO alert_recipients (alert_id, user_id)
        SELECT $1, id FROM users
        ON CONFLICT (alert_id, user_id) DO NOTHING
      `, [newAlert.id]);
      
      // Update delivery stats
      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      await pool.query(
        'UPDATE alert_delivery_stats SET total_recipients = $1, delivered_count = $1 WHERE alert_id = $2',
        [userCount.rows[0].count, newAlert.id]
      );
    }
    
    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Get user's alerts (for citizens)
router.get('/my-alerts', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const query = `
      SELECT 
        ca.*,
        ac.name as category_name,
        ac.color as category_color,
        ac.icon as category_icon,
        ar.is_read,
        ar.read_at
      FROM citizen_alerts ca
      JOIN alert_recipients ar ON ca.id = ar.alert_id
      LEFT JOIN alert_categories ac ON ca.category_id = ac.id
      WHERE ar.user_id = $1 
        AND ca.is_active = true 
        AND (ca.expires_at IS NULL OR ca.expires_at > CURRENT_TIMESTAMP)
      ORDER BY ca.priority DESC, ca.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    const alerts = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      message: row.message,
      alert_type: row.alert_type,
      priority: row.priority,
      created_at: row.created_at,
      is_read: row.is_read,
      read_at: row.read_at,
      category: row.category_name ? {
        name: row.category_name,
        color: row.category_color,
        icon: row.category_icon
      } : null
    }));
    
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching user alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Mark alert as read
router.post('/alerts/:alertId/mark-read', async (req: AuthenticatedRequest, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    await pool.query(
      'UPDATE alert_recipients SET is_read = true, read_at = CURRENT_TIMESTAMP WHERE alert_id = $1 AND user_id = $2',
      [alertId, userId]
    );
    
    // Update read count in delivery stats
    const readCount = await pool.query(
      'SELECT COUNT(*) FROM alert_recipients WHERE alert_id = $1 AND is_read = true',
      [alertId]
    );
    
    await pool.query(
      'UPDATE alert_delivery_stats SET read_count = $1 WHERE alert_id = $2',
      [readCount.rows[0].count, alertId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({ error: 'Failed to mark alert as read' });
  }
});

// Get alert statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalAlertsQuery = 'SELECT COUNT(*) FROM citizen_alerts WHERE is_active = true';
    const activeAlertsQuery = `
      SELECT COUNT(*) FROM citizen_alerts 
      WHERE is_active = true 
        AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;
    const totalRecipientsQuery = 'SELECT SUM(total_recipients) FROM alert_delivery_stats';
    const totalReadQuery = 'SELECT SUM(read_count) FROM alert_delivery_stats';
    
    const [totalAlerts, activeAlerts, totalRecipients, totalRead] = await Promise.all([
      pool.query(totalAlertsQuery),
      pool.query(activeAlertsQuery),
      pool.query(totalRecipientsQuery),
      pool.query(totalReadQuery)
    ]);
    
    const stats = {
      total_alerts: parseInt(totalAlerts.rows[0].count),
      active_alerts: parseInt(activeAlerts.rows[0].count),
      total_recipients: parseInt(totalRecipients.rows[0].sum || 0),
      total_read: parseInt(totalRead.rows[0].sum || 0),
      read_rate: totalRecipients.rows[0].sum > 0 
        ? ((totalRead.rows[0].sum || 0) / totalRecipients.rows[0].sum * 100).toFixed(2)
        : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
