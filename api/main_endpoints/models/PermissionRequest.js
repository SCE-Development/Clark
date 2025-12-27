const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PermissionRequestTypes = require('../util/permissionRequestTypes');

const PermissionRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.keys(PermissionRequestTypes),
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Compound unique index prevents duplicate active requests per user+type
PermissionRequestSchema.index({ userId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('PermissionRequest', PermissionRequestSchema);

