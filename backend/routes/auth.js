import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, role, name, walletAddress, licenseNumber, specialization, hospital, dateOfBirth, bloodType, emergencyContact } = req.body;

        // Validate required fields
        if (!email || !password || !role || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user exists
        const existingUser = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await db.runAsync(
            `INSERT INTO users (email, password, role, name, wallet_address, license_number, specialization, hospital, date_of_birth, blood_type, emergency_contact, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [email, hashedPassword, role, name, walletAddress || null, licenseNumber || null, specialization || null, hospital || null, dateOfBirth || null, bloodType || null, emergencyContact || null, role === 'patient' ? 1 : 0]
        );

        // Log activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [result.lastID, 'register', `User registered as ${role}`]
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.lastID,
            requiresVerification: role === 'doctor'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find user
        const user = await db.getAsync('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if doctor is verified
        if (user.role === 'doctor' && !user.is_verified) {
            return res.status(403).json({ error: 'Doctor account pending verification' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [user.id, 'login', 'User logged in']
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                walletAddress: user.wallet_address,
                isVerified: user.is_verified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Wallet Login
router.post('/wallet-login', async (req, res) => {
    try {
        const { walletAddress, role } = req.body;

        if (!walletAddress || !role) {
            return res.status(400).json({ error: 'Wallet address and role are required' });
        }

        // Find user by wallet address and role
        const user = await db.getAsync(
            'SELECT * FROM users WHERE wallet_address = ? AND role = ?',
            [walletAddress.toLowerCase(), role]
        );

        if (!user) {
            return res.status(401).json({ error: 'No account found with this wallet address' });
        }

        // Check if doctor is verified
        if (user.role === 'doctor' && !user.is_verified) {
            return res.status(403).json({ error: 'Doctor account pending verification' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log activity
        await db.runAsync(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [user.id, 'login', 'User logged in via wallet']
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                walletAddress: user.wallet_address,
                isVerified: user.is_verified
            }
        });
    } catch (error) {
        console.error('Wallet login error:', error);
        res.status(500).json({ error: 'Wallet login failed' });
    }
});

// Get profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await db.getAsync(
            'SELECT id, email, role, name, wallet_address, license_number, specialization, hospital, date_of_birth, blood_type, emergency_contact, is_verified, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

export default router;
