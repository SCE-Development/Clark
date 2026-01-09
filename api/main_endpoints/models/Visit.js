const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitSchema = new Schema(
  {
    visitCount: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['HOME_PAGE'],
      default: 'HOME_PAGE'
    }
  },
  { collection: 'Visit' }
);

module.exports = mongoose.model('Visit', VisitSchema);
