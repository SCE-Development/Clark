const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RfidSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // User's RFID card's indentifier a.k.a byte
    byte: {
      type: String,
      unique: true,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    lastScanned : {
      type: Date,
      default: Date.now,
    }
  },
  { collection: 'RFID' }
);

module.exports = mongoose.model('RFID', RfidSchema);
