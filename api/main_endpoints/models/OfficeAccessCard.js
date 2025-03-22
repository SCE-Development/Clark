const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OfficeAccessCardSchema = new Schema(
  {
    cardBytes: { //Need to add a new field to increment by 1 each time verify was called
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    verifiedCount:{
      type:Number,
      default:0
    },
    lastVerified:{
      type:Date,
      default: Date.now
    }
  },
  { collection: 'OfficeAccessCards' }
);

module.exports = mongoose.model('OfficeAccessCard', OfficeAccessCardSchema);
