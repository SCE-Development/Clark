const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AuditLogActions = require('../util/auditLogActions');

const AuditLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: Object.keys(AuditLogActions),
      required: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
