const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OfficeAccessCardSchema = new Schema(
  {
    cardBytes: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  },
  { collection: 'OfficeAccessCards' }
);

module.exports = mongoose.model('OfficeAccessCard', OfficeAccessCardSchema);
