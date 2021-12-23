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
    last_scanned: {
      type: String,
    },
  },
  { collection: 'RFID' }
);

module.exports = mongoose.model('RFID', RFIDSchema);
