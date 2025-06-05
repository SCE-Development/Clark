const AuditLog = require('../main_endpoints/models/AuditLog');

function logAudit({ userId, action, documentId = null, details = {} }) {
  try {
    AuditLog.create({ 
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
