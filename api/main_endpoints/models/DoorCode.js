const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoorCodeSchema = new Schema(
  {
    doorCode: {
      type: String,
      unique: true,
      required: true,
    },
    doorCodeValidUntil: {
      type: Date,
    },
    userEmails: {
      type: Array,
      default: [],
    }
  },
  { collection: 'DoorCodes' }
);

DoorCodeSchema.pre('save', function(next) {
  let doorcodeRegExp = new RegExp (['^[0-9]{3}-[0-9]{4}']);
  if (!this.doorCode.match(doorcodeRegExp)) {
    return next('Bad door code saved (format is: xxx-xxxx)');
  } else {
    return next();
  }
});

module.exports = mongoose.model('DoorCodes', DoorCodeSchema);
