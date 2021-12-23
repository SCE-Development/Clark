const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RFIDSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    byte: {
      type: String,
      require: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'RFID' }
);

module.exports = mongoose.model('RFID', RFIDSchema);
