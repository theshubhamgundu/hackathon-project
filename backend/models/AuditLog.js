const db = require('../storage/database');

class AuditLog {
    static async create(logData) {
        return await db.createAuditLog(logData);
    }

    static async find(query, options = {}) {
        return await db.findAuditLogs(query, options);
    }

    static async findByUserId(userId, limit = 100) {
        return await db.findAuditLogs({ userId }, { limit });
    }

    static async findByAction(action, limit = 100) {
        return await db.findAuditLogs({ action }, { limit });
    }

    // Valid action types
    static get ACTIONS() {
        return {
            LOGIN: 'LOGIN',
            LOGOUT: 'LOGOUT',
            KYC_SUBMIT: 'KYC_SUBMIT',
            KYC_UPDATE: 'KYC_UPDATE',
            INVESTMENT_DEPOSIT: 'INVESTMENT_DEPOSIT',
            INVESTMENT_WITHDRAW: 'INVESTMENT_WITHDRAW',
            SETTINGS_CHANGE: 'SETTINGS_CHANGE',
            FAILED_AUTH: 'FAILED_AUTH',
            FRAUD_ALERT: 'FRAUD_ALERT'
        };
    }
}

module.exports = AuditLog;
