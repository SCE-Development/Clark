const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfficerSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    facebook: {
      type: String
    },
    github: {
      type: String
    },
    instagram: {
      type: String
    },
    // The access level is defined as follows:
    // -2: Ban
    // -1: Pending
    // 0: Member
    // 1: Officer
    // 2: Admin
    level: {
      type: Number,
      require: true
    },
    team: {
      type: String,
      require: true
    },
    quote: {
      type: String
    },
    major: {
      type: String,
      require: true
    }
  },
  { collection: 'Officers' }
);

module.exports = mongoose.model('Officers', OfficerSchema);
