const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class LocalDatabase {
    constructor() {
        this.dataDir = path.join(__dirname, 'data');
        this.collections = {
            users: 'users.json',
            auditLogs: 'auditLogs.json',
            investments: 'investments.json'
        };
    }

    async init() {
        try {
            // Create data directory if it doesn't exist
            await fs.mkdir(this.dataDir, { recursive: true });

            // Initialize JSON files for each collection
            for (const [key, filename] of Object.entries(this.collections)) {
                const filePath = path.join(this.dataDir, filename);
                try {
                    await fs.access(filePath);
                } catch {
                    // File doesn't exist, create it with empty array
                    await fs.writeFile(filePath, JSON.stringify([], null, 2));
                }
            }

            console.log('✓ Local storage initialized successfully');
        } catch (error) {
            console.error('Local storage initialization error:', error);
            throw error;
        }
    }

    async readCollection(collectionName) {
        const filePath = path.join(this.dataDir, this.collections[collectionName]);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }

    async writeCollection(collectionName, data) {
        const filePath = path.join(this.dataDir, this.collections[collectionName]);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    generateId() {
        return crypto.randomBytes(12).toString('hex');
    }

    // User operations
    async createUser(userData) {
        const users = await this.readCollection('users');

        // Check if email or wallet already exists
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Email already exists');
        }
        if (users.find(u => u.walletAddress === userData.walletAddress)) {
            throw new Error('Wallet address already exists');
        }

        const newUser = {
            _id: this.generateId(),
            email: userData.email,
            password: userData.password,
            walletAddress: userData.walletAddress,
            kycStatus: 'pending',
            kycData: null,
            deviceFingerprints: [],
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        users.push(newUser);
        await this.writeCollection('users', users);
        return newUser;
    }

    async findUserById(userId) {
        const users = await this.readCollection('users');
        return users.find(u => u._id === userId);
    }

    async findUserByEmail(email) {
        const users = await this.readCollection('users');
        return users.find(u => u.email === email);
    }

    async findUserByWallet(walletAddress) {
        const users = await this.readCollection('users');
        return users.find(u => u.walletAddress === walletAddress.toLowerCase());
    }

    async updateUser(userId, updates) {
        const users = await this.readCollection('users');
        const index = users.findIndex(u => u._id === userId);

        if (index === -1) {
            throw new Error('User not found');
        }

        users[index] = { ...users[index], ...updates };
        await this.writeCollection('users', users);
        return users[index];
    }

    // Audit Log operations
    async createAuditLog(logData) {
        const logs = await this.readCollection('auditLogs');

        const newLog = {
            _id: this.generateId(),
            userId: logData.userId,
            action: logData.action,
            details: logData.details || {},
            ipAddress: logData.ipAddress || null,
            userAgent: logData.userAgent || null,
            timestamp: new Date().toISOString(),
            blockchainTx: logData.blockchainTx || null
        };

        logs.push(newLog);
        await this.writeCollection('auditLogs', logs);
        return newLog;
    }

    async findAuditLogs(query, options = {}) {
        let logs = await this.readCollection('auditLogs');

        // Filter by query
        if (query.userId) {
            logs = logs.filter(log => log.userId === query.userId);
        }
        if (query.action) {
            logs = logs.filter(log => log.action === query.action);
        }

        // Sort by timestamp (newest first)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Limit results
        if (options.limit) {
            logs = logs.slice(0, options.limit);
        }

        return logs;
    }

    // Investment operations
    async createInvestment(investmentData) {
        const investments = await this.readCollection('investments');

        const newInvestment = {
            _id: this.generateId(),
            userId: investmentData.userId,
            poolId: investmentData.poolId,
            amount: investmentData.amount,
            type: investmentData.type, // 'deposit' or 'withdrawal'
            status: investmentData.status || 'pending',
            timestamp: new Date().toISOString(),
            blockchainTx: investmentData.blockchainTx || null
        };

        investments.push(newInvestment);
        await this.writeCollection('investments', investments);
        return newInvestment;
    }

    async findInvestmentsByUser(userId) {
        const investments = await this.readCollection('investments');
        return investments.filter(inv => inv.userId === userId);
    }
}

// Create singleton instance
const db = new LocalDatabase();

module.exports = db;
