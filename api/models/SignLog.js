const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SignLogSchema = new Schema(
  {
    signTitle: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    timeOfPosting: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  { collection: 'SignLogs' }
)

module.exports = mongoose.model('SignLog', SignLogSchema)
