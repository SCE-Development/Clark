
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema(
  {
    aID: {
      type: Number,
      required: true
    },
    senderID: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    msgContent: {
      type: String,
      required: true
    },
    imgPath: {
      type: String
    }
  },
  { collection: 'Announcement' }
);

export const AnnouncementModel = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);