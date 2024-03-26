
import mongoose from "mongoose";

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
  { collection: 'Advertisements' }
);
export const AdvertisementModel = mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);