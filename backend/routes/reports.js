import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import db from '../database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Upload medical report
router.post('/upload', authenticateToken, authorizeRole('patient'), upload.single('file'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const file = req.file;

        if (!file || !title) {
            return res.status(400).json({ error: 'File and title are required' });
        }

        // Calculate file hash
        const fileBuffer = fs.readFileSync(file.path);
        const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // Get file size in readable format
        const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        // Insert report
        const result = await db.runAsync(
            `INSERT INTO medical_reports (patient_id, title, description, file_name, file_path, file_hash, file_size, file_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, title, description || '', file.originalname, file.path, fileHash, fileSize, file.mimetype]
        );

        // Log activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, report_id, action, details) VALUES (?, ?, ?, ?)',
            [req.user.id, result.lastID, 'upload', `Uploaded report: ${title}`]
        );

        res.status(201).json({
            message: 'Report uploaded successfully',
            report: {
                id: result.lastID,
                title,
                description,
                fileName: file.originalname,
                fileHash,
                fileSize,
                uploadDate: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload report' });
    }
});

// Get all reports for current user
router.get('/', authenticateToken, async (req, res) => {
    try {
        let reports;

        if (req.user.role === 'patient') {
            // Get patient's own reports
            reports = await db.allAsync(
                `SELECT r.*, 
         (SELECT COUNT(*) FROM access_permissions WHERE report_id = r.id AND status = 'active') as active_permissions
         FROM medical_reports r
         WHERE r.patient_id = ?
         ORDER BY r.upload_date DESC`,
                [req.user.id]
            );
        } else if (req.user.role === 'doctor') {
            // Get reports doctor has access to
            reports = await db.allAsync(
                `SELECT r.*, u.name as patient_name, ap.granted_at, ap.expires_at
         FROM medical_reports r
         JOIN access_permissions ap ON r.id = ap.report_id
         JOIN users u ON r.patient_id = u.id
         WHERE ap.doctor_id = ? AND ap.status = 'active'
         ORDER BY r.upload_date DESC`,
                [req.user.id]
            );
        } else {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(reports);
    } catch (error) {
        console.error('Fetch reports error:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Get specific report
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const reportId = req.params.id;

        // Get report
        const report = await db.getAsync('SELECT * FROM medical_reports WHERE id = ?', [reportId]);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Check access
        let hasAccess = false;
        if (req.user.role === 'patient' && report.patient_id === req.user.id) {
            hasAccess = true;
        } else if (req.user.role === 'doctor') {
            const permission = await db.getAsync(
                'SELECT * FROM access_permissions WHERE report_id = ? AND doctor_id = ? AND status = "active"',
                [reportId, req.user.id]
            );
            hasAccess = !!permission;
        }

        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Get access list if patient
        if (req.user.role === 'patient') {
            const accessList = await db.allAsync(
                `SELECT ap.*, u.name as doctor_name, u.specialization
         FROM access_permissions ap
         JOIN users u ON ap.doctor_id = u.id
         WHERE ap.report_id = ?
         ORDER BY ap.created_at DESC`,
                [reportId]
            );
            report.accessList = accessList;
        }

        // Log view activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, report_id, action, details) VALUES (?, ?, ?, ?)',
            [req.user.id, reportId, 'view', `Viewed report: ${report.title}`]
        );

        res.json(report);
    } catch (error) {
        console.error('Fetch report error:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});

// Download report file
router.get('/:id/download', authenticateToken, async (req, res) => {
    try {
        const reportId = req.params.id;

        // Get report
        const report = await db.getAsync('SELECT * FROM medical_reports WHERE id = ?', [reportId]);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Check access
        let hasAccess = false;
        if (req.user.role === 'patient' && report.patient_id === req.user.id) {
            hasAccess = true;
        } else if (req.user.role === 'doctor') {
            const permission = await db.getAsync(
                'SELECT * FROM access_permissions WHERE report_id = ? AND doctor_id = ? AND status = "active"',
                [reportId, req.user.id]
            );
            hasAccess = !!permission;
        }

        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Send file
        res.download(report.file_path, report.file_name);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download report' });
    }
});

export default router;
