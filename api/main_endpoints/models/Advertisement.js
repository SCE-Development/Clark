const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvertisementSchema = new Schema(
  {
    saying: {
      type: String,
      required: true,
      maxlength: [255, 'Saying must be at most 255 characters long'] 
    },
    expireDate: {
      type: Date,
    }
  },
  { collection: 'Advertisements' }
);

module.exports = mongoose.model('Advertisement', AdvertisementSchema);