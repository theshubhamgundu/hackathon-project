const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Check device fingerprint
router.post('/check-device', authMiddleware, async (req, res) => {
    try {
        const { fingerprint } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if fingerprint exists
        const existingFingerprint = user.deviceFingerprints.find(
            (fp) => fp.fingerprint === fingerprint
        );

        if (existingFingerprint) {
            existingFingerprint.lastSeen = new Date().toISOString();
            await User.updateById(req.userId, { deviceFingerprints: user.deviceFingerprints });

            res.json({
                known: true,
                trusted: existingFingerprint.trusted,
            });
        } else {
            // New device
            user.deviceFingerprints.push({
                fingerprint,
                lastSeen: new Date().toISOString(),
                trusted: false,
            });
            await User.updateById(req.userId, { deviceFingerprints: user.deviceFingerprints });

            res.json({
                known: false,
                trusted: false,
                message: 'New device detected',
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Device check failed' });
    }
});

// Get risk score
router.get('/risk-score', authMiddleware, async (req, res) => {
    try {
        // Simplified risk scoring
        const user = await User.findById(req.userId);

        let score = 0;

        // New account = higher risk
        const accountAge = Date.now() - new Date(user.createdAt).getTime();
        if (accountAge < 7 * 24 * 60 * 60 * 1000) {
            score += 20;
        }

        // No KYC = high risk
        if (user.kycStatus !== 'approved') {
            score += 40;
        }

        // Multiple devices = medium risk
        if (user.deviceFingerprints.length > 3) {
            score += 15;
        }

        res.json({ riskScore: Math.min(score, 100) });
    } catch (error) {
        res.status(500).json({ error: 'Risk score calculation failed' });
    }
});

// Get fraud alerts
router.get('/alerts', authMiddleware, async (req, res) => {
    try {
        const AuditLog = require('../models/AuditLog');
        const alerts = await AuditLog.find({
            userId: req.userId,
            action: 'FRAUD_ALERT',
        })
            .sort({ timestamp: -1 })
            .limit(10);

        res.json({ alerts });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

module.exports = router;
