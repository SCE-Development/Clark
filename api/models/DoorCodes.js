const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoorCodeSchema = new Schema(
  {
    doorCode: {
      type: String,
      required: true,
    },
    doorCodeValidUntil: {
      type: Date,
    },
    usersAssigned: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { collection: 'DoorCodes' }
);

module.exports = mongoose.model('DoorCodes', DoorCodeSchema);
