const AuditLog = require('../main_endpoints/models/AuditLog');

async function logAudit({ userId, action, documentId = null, details = {} }) {
  try {
    await AuditLog.create({
      userId,
      action,
      documentId,
      details,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = logAudit;
