const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    }
  },
  { collection: 'Event' }
)

module.exports = mongoose.model('Event', EventSchema)
