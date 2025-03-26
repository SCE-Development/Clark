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
    verifiedCount:{ //Checks how many times the card has been verified
      type:Number,
      default:0
    },
    lastVerified:{ //Checks last time the card was verified
      type:Date,
      default: Date.now
    }
  },
  { collection: 'OfficeAccessCards' }
);

module.exports = mongoose.model('OfficeAccessCard', OfficeAccessCardSchema);
