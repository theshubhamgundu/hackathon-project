const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, walletAddress } = req.body;

        // Validation
        if (!email || !password || !walletAddress) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existingEmail = await User.findByEmail(email);
        const existingWallet = await User.findByWallet(walletAddress);
        if (existingEmail || existingWallet) {
            return res.status(400).json({ error: 'User with this email or wallet already exists' });
        }

        // Create user
        const user = await User.create({ email, password, walletAddress });

        // Log action
        await AuditLog.create({
            userId: user._id,
            action: 'LOGIN',
            details: { type: 'registration' },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id, walletAddress: user.walletAddress },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                walletAddress: user.walletAddress,
                kycStatus: user.kycStatus,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, walletAddress } = req.body;

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            await AuditLog.create({
                userId: user._id,
                action: 'FAILED_AUTH',
                details: { reason: 'invalid_password' },
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify wallet address matches
        if (walletAddress && user.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ error: 'Wallet address mismatch' });
        }

        // Update last login
        await User.updateById(user._id, { lastLogin: new Date().toISOString() });

        // Log successful login
        await AuditLog.create({
            userId: user._id,
            action: 'LOGIN',
            details: { walletAddress },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id, walletAddress: user.walletAddress },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                walletAddress: user.walletAddress,
                kycStatus: user.kycStatus,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Verify token
router.get('/verify', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                walletAddress: user.walletAddress,
                kycStatus: user.kycStatus,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Logout (client-side token deletion, log for audit)
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        await AuditLog.create({
            userId: req.userId,
            action: 'LOGOUT',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

module.exports = router;
