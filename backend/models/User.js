const bcrypt = require('bcrypt');
const db = require('../storage/database');

class User {
    static async create(userData) {
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const user = await db.createUser({
            email: userData.email.toLowerCase().trim(),
            password: hashedPassword,
            walletAddress: userData.walletAddress.toLowerCase(),
        });

        return user;
    }

    static async findById(userId) {
        return await db.findUserById(userId);
    }

    static async findByEmail(email) {
        return await db.findUserByEmail(email.toLowerCase().trim());
    }

    static async findByWallet(walletAddress) {
        return await db.findUserByWallet(walletAddress);
    }

    static async updateById(userId, updates) {
        return await db.updateUser(userId, updates);
    }

    static async comparePassword(candidatePassword, hashedPassword) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }

    static async updatePassword(userId, newPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        return await db.updateUser(userId, { password: hashedPassword });
    }

    // Helper method to add device fingerprint
    static async addDeviceFingerprint(userId, fingerprint) {
        const user = await db.findUserById(userId);
        if (!user) throw new Error('User not found');

        const existingIndex = user.deviceFingerprints.findIndex(
            fp => fp.fingerprint === fingerprint
        );

        if (existingIndex >= 0) {
            user.deviceFingerprints[existingIndex].lastSeen = new Date().toISOString();
        } else {
            user.deviceFingerprints.push({
                fingerprint,
                lastSeen: new Date().toISOString(),
                trusted: false
            });
        }

        return await db.updateUser(userId, { deviceFingerprints: user.deviceFingerprints });
    }

    // Helper method to update KYC
    static async updateKYC(userId, kycData, status = 'pending') {
        return await db.updateUser(userId, {
            kycData,
            kycStatus: status
        });
    }
}

module.exports = User;
