const AuditLog = require('../models/AuditLog');
const logger = require('../../util/logger');
const {
  SERVER_ERROR,
} = require('../../util/constants.js').STATUS_CODES;

/**
 * Creates an audit log entry.
 * @param {Object} params - The parameters for the audit log.
 * @param {Object} params.user - User object containing at least `_id`.
 * @param {string} params.action - Action type from `AuditLogActions`.
 * @param {Object} params.details - Additional details for the log.
 * @returns {Object|undefined} - Returns error object if failed, otherwise undefined.
 */
const createAuditLog = async ({ user, action, details }) => {
  try {
    await AuditLog.create({
      userId: user._id,
      action,
      details
    });
  } catch(err) {
    logger.error('auditLogHelpers had an error', err);
    if (err.response && err.response.data) {
      return {
        status: err.response.status,
        error: err.response.data
      };
    } else {
      return {
        status: SERVER_ERROR,
        error: 'Failed to create audit log in cleezyHelpers'
      };
    }
  }

};
module.exports = { createAuditLog };
