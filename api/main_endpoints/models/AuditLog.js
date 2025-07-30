const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AuditLogActions = require('../util/auditLogActions');
const { writeLogToClient } = require('../util/AuditLog');

const AuditLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      enum: Object.keys(AuditLogActions),
      required: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ _id: 1, action: 1 });

AuditLogSchema.post('save', async function(doc) {
  const newDoc = await doc.constructor.findById(doc._id).populate('userId', 'firstName lastName email');
  writeLogToClient({message: newDoc});
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
