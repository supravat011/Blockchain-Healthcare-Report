import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Upload diagnosis (Doctor)
router.post('/upload', authenticateToken, authorizeRole('doctor'), upload.single('file'), async (req, res) => {
    try {
        const { reportId, patientId, title, description } = req.body;
        const file = req.file;

        if (!reportId || !patientId || !title) {
            return res.status(400).json({ error: 'Report ID, patient ID, and title are required' });
        }

        // Check if doctor has access to the report
        const permission = await db.getAsync(
            'SELECT * FROM access_permissions WHERE report_id = ? AND doctor_id = ? AND patient_id = ? AND status = "active"',
            [reportId, req.user.id, patientId]
        );

        if (!permission) {
            return res.status(403).json({ error: 'You do not have access to this report' });
        }

        // Insert diagnosis
        const result = await db.runAsync(
            `INSERT INTO diagnoses (doctor_id, patient_id, report_id, title, description, file_name, file_path)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, patientId, reportId, title, description || '', file?.originalname || null, file?.path || null]
        );

        // Log activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, report_id, action, details) VALUES (?, ?, ?, ?)',
            [req.user.id, reportId, 'upload_diagnosis', `Uploaded diagnosis: ${title}`]
        );

        res.status(201).json({
            message: 'Diagnosis uploaded successfully',
            diagnosisId: result.lastID
        });
    } catch (error) {
        console.error('Upload diagnosis error:', error);
        res.status(500).json({ error: 'Failed to upload diagnosis' });
    }
});

// Get diagnoses for a report
router.get('/report/:reportId', authenticateToken, async (req, res) => {
    try {
        const reportId = req.params.reportId;

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

        // Get diagnoses
        const diagnoses = await db.allAsync(
            `SELECT d.*, u.name as doctor_name, u.specialization
       FROM diagnoses d
       JOIN users u ON d.doctor_id = u.id
       WHERE d.report_id = ?
       ORDER BY d.upload_date DESC`,
            [reportId]
        );

        res.json(diagnoses);
    } catch (error) {
        console.error('Fetch diagnoses error:', error);
        res.status(500).json({ error: 'Failed to fetch diagnoses' });
    }
});

// Get all diagnoses for patient
router.get('/patient', authenticateToken, authorizeRole('patient'), async (req, res) => {
    try {
        const diagnoses = await db.allAsync(
            `SELECT d.*, u.name as doctor_name, u.specialization, r.title as report_title
       FROM diagnoses d
       JOIN users u ON d.doctor_id = u.id
       JOIN medical_reports r ON d.report_id = r.id
       WHERE d.patient_id = ?
       ORDER BY d.upload_date DESC`,
            [req.user.id]
        );

        res.json(diagnoses);
    } catch (error) {
        console.error('Fetch patient diagnoses error:', error);
        res.status(500).json({ error: 'Failed to fetch diagnoses' });
    }
});

export default router;
