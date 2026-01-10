import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Request access to a report (Doctor)
router.post('/request', authenticateToken, authorizeRole('doctor'), async (req, res) => {
    try {
        const { reportId, patientId, reason } = req.body;

        if (!reportId || !patientId || !reason) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if report exists
        const report = await db.getAsync('SELECT * FROM medical_reports WHERE id = ? AND patient_id = ?', [reportId, patientId]);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Check if request already exists
        const existing = await db.getAsync(
            'SELECT * FROM access_permissions WHERE report_id = ? AND doctor_id = ? AND patient_id = ?',
            [reportId, req.user.id, patientId]
        );

        if (existing) {
            return res.status(400).json({ error: 'Access request already exists' });
        }

        // Create access request
        const result = await db.runAsync(
            'INSERT INTO access_permissions (report_id, doctor_id, patient_id, status, reason) VALUES (?, ?, ?, ?, ?)',
            [reportId, req.user.id, patientId, 'pending', reason]
        );

        // Log activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, report_id, action, details) VALUES (?, ?, ?, ?)',
            [req.user.id, reportId, 'request_access', `Requested access to report: ${report.title}`]
        );

        res.status(201).json({
            message: 'Access request sent successfully',
            requestId: result.lastID
        });
    } catch (error) {
        console.error('Request access error:', error);
        res.status(500).json({ error: 'Failed to request access' });
    }
});

// Get access requests (Patient)
router.get('/requests', authenticateToken, authorizeRole('patient'), async (req, res) => {
    try {
        const requests = await db.allAsync(
            `SELECT ap.*, u.name as doctor_name, u.specialization, u.hospital, r.title as report_title
       FROM access_permissions ap
       JOIN users u ON ap.doctor_id = u.id
       JOIN medical_reports r ON ap.report_id = r.id
       WHERE ap.patient_id = ?
       ORDER BY ap.created_at DESC`,
            [req.user.id]
        );

        res.json(requests);
    } catch (error) {
        console.error('Fetch requests error:', error);
        res.status(500).json({ error: 'Failed to fetch access requests' });
    }
});

// Grant access (Patient)
router.post('/grant', authenticateToken, authorizeRole('patient'), async (req, res) => {
    try {
        const { requestId, expiresInDays } = req.body;

        if (!requestId) {
            return res.status(400).json({ error: 'Request ID is required' });
        }

        // Get request
        const request = await db.getAsync(
            'SELECT * FROM access_permissions WHERE id = ? AND patient_id = ?',
            [requestId, req.user.id]
        );

        if (!request) {
            return res.status(404).json({ error: 'Access request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'Request already processed' });
        }

        // Calculate expiry date
        let expiresAt = null;
        if (expiresInDays) {
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + parseInt(expiresInDays));
            expiresAt = expiry.toISOString();
        }

        // Update request
        await db.runAsync(
            'UPDATE access_permissions SET status = ?, granted_at = CURRENT_TIMESTAMP, expires_at = ? WHERE id = ?',
            ['active', expiresAt, requestId]
        );

        // Get report details
        const report = await db.getAsync('SELECT * FROM medical_reports WHERE id = ?', [request.report_id]);

        // Log activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, report_id, action, details) VALUES (?, ?, ?, ?)',
            [req.user.id, request.report_id, 'grant_access', `Granted access to doctor for report: ${report.title}`]
        );

        res.json({ message: 'Access granted successfully' });
    } catch (error) {
        console.error('Grant access error:', error);
        res.status(500).json({ error: 'Failed to grant access' });
    }
});

// Revoke access (Patient)
router.post('/revoke', authenticateToken, authorizeRole('patient'), async (req, res) => {
    try {
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({ error: 'Request ID is required' });
        }

        // Get request
        const request = await db.getAsync(
            'SELECT * FROM access_permissions WHERE id = ? AND patient_id = ?',
            [requestId, req.user.id]
        );

        if (!request) {
            return res.status(404).json({ error: 'Access permission not found' });
        }

        // Update request
        await db.runAsync(
            'UPDATE access_permissions SET status = ? WHERE id = ?',
            ['revoked', requestId]
        );

        // Get report details
        const report = await db.getAsync('SELECT * FROM medical_reports WHERE id = ?', [request.report_id]);

        // Log activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, report_id, action, details) VALUES (?, ?, ?, ?)',
            [req.user.id, request.report_id, 'revoke_access', `Revoked access from doctor for report: ${report.title}`]
        );

        res.json({ message: 'Access revoked successfully' });
    } catch (error) {
        console.error('Revoke access error:', error);
        res.status(500).json({ error: 'Failed to revoke access' });
    }
});

// Get doctor's access permissions
router.get('/permissions', authenticateToken, authorizeRole('doctor'), async (req, res) => {
    try {
        const permissions = await db.allAsync(
            `SELECT ap.*, u.name as patient_name, r.title as report_title
       FROM access_permissions ap
       JOIN users u ON ap.patient_id = u.id
       JOIN medical_reports r ON ap.report_id = r.id
       WHERE ap.doctor_id = ?
       ORDER BY ap.created_at DESC`,
            [req.user.id]
        );

        res.json(permissions);
    } catch (error) {
        console.error('Fetch permissions error:', error);
        res.status(500).json({ error: 'Failed to fetch permissions' });
    }
});

export default router;
