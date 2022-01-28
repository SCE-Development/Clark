const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrintLogSchema = new Schema(
  {
    numPages: {
      type: Number,
      required: true
    },
    chosenPrinter: {
      type: String,
    },
    printedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    memberName: {
      type: String,
      required: true
    }
  },
  { collection: 'PrintLogs' }
);

module.exports = mongoose.model('PrintLog', PrintLogSchema);
