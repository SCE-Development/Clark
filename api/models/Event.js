const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DEFAULT_PHOTO_URL =
  'https://sce.engr.sjsu.edu/wp-content/uploads/2016/04/SCE_sq.png'

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    eventLocation: {
      type: String,
      required: true
    },
    eventDate: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    eventCategory: {
      type: String
    },
    imageURL: {
      type: String,
      default: DEFAULT_PHOTO_URL
    }
  },
  { collection: 'Event' }
)

module.exports = mongoose.model('Event', EventSchema)
