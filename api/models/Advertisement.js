const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvertisementSchema = new Schema(
  {
    pictureUrl: {
      type: String,
      required: true
    },
    createDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    expireDate: {
      type: Date
    }
  },
  { collection: 'Advertisement' }
);

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
