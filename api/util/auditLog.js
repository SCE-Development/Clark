const AuditLog = require('../main_endpoints/models/AuditLog');
const logger = require('../util/logger');

async function logAudit({ userId, action, documentId = null, details = {} }) {
  try {
    await AuditLog.create({
      userId,
      action,
      documentId,
      details,
    });
  } catch (error) {
    logger.error('Audit log failed to create:', error);
  }
}

module.exports = {logAudit};
