const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrintingLogSchema = new Schema(
  {
    numPages: {
      type: Number,
      required: true
    },
    chosenPrinter: {
      type: String,
      required: true
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
  { collection: 'PrintingLogs' }
);

module.exoprts = mongoose.model('PrintingLog', PrintingLogSchema);
