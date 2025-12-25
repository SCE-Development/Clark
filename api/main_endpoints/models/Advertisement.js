const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvertisementSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      maxlength: [255, 'message must be at most 255 characters long']
    },
    expireAt: {
      type: Date,
      default: undefined,
      index: {expireAfterSeconds: 0}, // TTL only kicks in when expireAt is set
    }
  },
  { collection: 'Advertisements', timestamps: { createdAt: true } }
);

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
