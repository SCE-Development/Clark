const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AuditActions = require('../util/auditActions');

const AuditLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: Object.keys(AuditActions),
      required: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
