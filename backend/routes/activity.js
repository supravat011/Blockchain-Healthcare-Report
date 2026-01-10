import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get activity logs
router.get('/', authenticateToken, async (req, res) => {
    try {
        let logs;

        if (req.user.role === 'patient') {
            // Get patient's activity logs
            logs = await db.allAsync(
                `SELECT al.*, u.name as user_name, r.title as report_title
         FROM activity_logs al
         LEFT JOIN users u ON al.user_id = u.id
         LEFT JOIN medical_reports r ON al.report_id = r.id
         WHERE al.user_id = ? OR r.patient_id = ?
         ORDER BY al.timestamp DESC
         LIMIT 100`,
                [req.user.id, req.user.id]
            );
        } else if (req.user.role === 'doctor') {
            // Get doctor's activity logs
            logs = await db.allAsync(
                `SELECT al.*, u.name as user_name, r.title as report_title
         FROM activity_logs al
         LEFT JOIN users u ON al.user_id = u.id
         LEFT JOIN medical_reports r ON al.report_id = r.id
         WHERE al.user_id = ?
         ORDER BY al.timestamp DESC
         LIMIT 100`,
                [req.user.id]
            );
        } else if (req.user.role === 'hospital') {
            // Get all activity logs for admin
            logs = await db.allAsync(
                `SELECT al.*, u.name as user_name, u.role as user_role, r.title as report_title
         FROM activity_logs al
         LEFT JOIN users u ON al.user_id = u.id
         LEFT JOIN medical_reports r ON al.report_id = r.id
         ORDER BY al.timestamp DESC
         LIMIT 200`,
                []
            );
        }

        res.json(logs);
    } catch (error) {
        console.error('Fetch activity error:', error);
        res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
});

export default router;
