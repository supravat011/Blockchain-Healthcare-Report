import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all doctors for verification
router.get('/doctors', authenticateToken, authorizeRole('hospital'), async (req, res) => {
    try {
        const doctors = await db.allAsync(
            `SELECT id, email, name, license_number, specialization, hospital, is_verified, created_at
       FROM users
       WHERE role = 'doctor'
       ORDER BY created_at DESC`
        );

        res.json(doctors);
    } catch (error) {
        console.error('Fetch doctors error:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

// Verify doctor
router.put('/verify-doctor/:id', authenticateToken, authorizeRole('hospital'), async (req, res) => {
    try {
        const doctorId = req.params.id;
        const { isVerified } = req.body;

        // Update doctor verification status
        await db.runAsync(
            'UPDATE users SET is_verified = ? WHERE id = ? AND role = ?',
            [isVerified ? 1 : 0, doctorId, 'doctor']
        );

        // Get doctor details
        const doctor = await db.getAsync('SELECT * FROM users WHERE id = ?', [doctorId]);

        // Log activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [req.user.id, 'verify_doctor', `${isVerified ? 'Verified' : 'Unverified'} doctor: ${doctor.name}`]
        );

        res.json({ message: `Doctor ${isVerified ? 'verified' : 'unverified'} successfully` });
    } catch (error) {
        console.error('Verify doctor error:', error);
        res.status(500).json({ error: 'Failed to verify doctor' });
    }
});

// Get system statistics
router.get('/stats', authenticateToken, authorizeRole('hospital'), async (req, res) => {
    try {
        const stats = {
            totalUsers: 0,
            totalPatients: 0,
            totalDoctors: 0,
            verifiedDoctors: 0,
            totalReports: 0,
            totalAccessRequests: 0,
            pendingRequests: 0,
            activePermissions: 0
        };

        // Get user counts
        const userCounts = await db.allAsync('SELECT role, COUNT(*) as count FROM users GROUP BY role');
        userCounts.forEach(row => {
            if (row.role === 'patient') stats.totalPatients = row.count;
            if (row.role === 'doctor') stats.totalDoctors = row.count;
            stats.totalUsers += row.count;
        });

        // Get verified doctors
        const verifiedDoctors = await db.getAsync('SELECT COUNT(*) as count FROM users WHERE role = "doctor" AND is_verified = 1');
        stats.verifiedDoctors = verifiedDoctors.count;

        // Get report count
        const reports = await db.getAsync('SELECT COUNT(*) as count FROM medical_reports');
        stats.totalReports = reports.count;

        // Get access request counts
        const accessRequests = await db.getAsync('SELECT COUNT(*) as count FROM access_permissions');
        stats.totalAccessRequests = accessRequests.count;

        const pendingRequests = await db.getAsync('SELECT COUNT(*) as count FROM access_permissions WHERE status = "pending"');
        stats.pendingRequests = pendingRequests.count;

        const activePermissions = await db.getAsync('SELECT COUNT(*) as count FROM access_permissions WHERE status = "active"');
        stats.activePermissions = activePermissions.count;

        res.json(stats);
    } catch (error) {
        console.error('Fetch stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get all system logs
router.get('/logs', authenticateToken, authorizeRole('hospital'), async (req, res) => {
    try {
        const logs = await db.allAsync(
            `SELECT al.*, u.name as user_name, u.role as user_role, r.title as report_title
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       LEFT JOIN medical_reports r ON al.report_id = r.id
       ORDER BY al.timestamp DESC
       LIMIT 500`
        );

        res.json(logs);
    } catch (error) {
        console.error('Fetch logs error:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

export default router;
