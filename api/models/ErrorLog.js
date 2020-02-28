const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ErrorLogSchema = new Schema(
  {
    userEmail: {
      type: String
    },
    errorTime: {
      type: Date,
      required: true,
      default: Date.now
    },
    apiEndpoint: {
      type: String,
      required: true
    },
    errorDescription: {
      type: String,
      required: true
    }
  },
  { collection: 'ErrorLogs' }
)

module.exports = mongoose.model('ErrorLog', ErrorLogSchema)
