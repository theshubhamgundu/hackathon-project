const express = require('express');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Submit KYC data (encrypted on client-side)
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { encryptedData } = req.body;

        if (!encryptedData) {
            return res.status(400).json({ error: 'KYC data required' });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Store encrypted KYC data
        await User.updateById(req.userId, {
            kycData: encryptedData,
            kycStatus: 'pending'
        });

        // Log KYC submission
        await AuditLog.create({
            userId: user._id,
            action: 'KYC_SUBMIT',
            details: { status: 'pending' },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        res.json({
            message: 'KYC data submitted successfully',
            kycStatus: user.kycStatus,
        });
    } catch (error) {
        console.error('KYC submission error:', error);
        res.status(500).json({ error: 'KYC submission failed' });
    }
});

// Get KYC status
router.get('/status', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ kycStatus: user.kycStatus });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch KYC status' });
    }
});

// Update KYC data
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const { encryptedData } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.updateById(req.userId, { kycData: encryptedData });

        await AuditLog.create({
            userId: user._id,
            action: 'KYC_UPDATE',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        res.json({ message: 'KYC data updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'KYC update failed' });
    }
});

module.exports = router;
