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
    }
  },
  { collection: 'SignLogs' }
)

module.exports = mongoose.model('SignLog', SignLogSchema)
