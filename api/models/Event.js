const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    eventDate: {
      type: Date,
      required: true
    },
    datePosted: {
      type: Date,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    eventCategory: {
      type: String,
      required: false
    }
  },
  { collection: 'Event' }
)

module.exports = mongoose.model('Event', EventSchema)
