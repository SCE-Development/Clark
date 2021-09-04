const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DEFAULT_PHOTO_URL } = require('../util/constants');

const OfficerSchema = new Schema(
  {
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
    linkedin: {
      type: String
    },
    team: {
      type: String,
      require: true
    },
    quote: {
      type: String
    },
    pictureUrl: {
      type: String,
      default: DEFAULT_PHOTO_URL
    }
  },
  { collection: 'Officers' }
);

module.exports = mongoose.model('Officers', OfficerSchema);
