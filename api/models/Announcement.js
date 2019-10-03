const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
)

module.exports = mongoose.model('Announcement', AnnouncementSchema)
