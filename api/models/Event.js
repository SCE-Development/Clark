const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true
    },
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
      type: String,
      required: true
    },
    datePosted: {
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
      type: String,
      required: false
    }
  },
  { collection: 'Event' }
)

module.exports = mongoose.model('Event', EventSchema)
