const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OfficerSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    facebook: {
      type: String
    },
    github: {
      type: String
    },
    instagram: {
      type: String
    },
    role: {
      type: String,
      require: true
    },
    picture: {
      type: String,
      require: true
    },
    quote: {
      type: String
    },
    major: {
      type: String,
      require: true
    }
  },
  { collection: 'Officers' }
)

module.exports = mongoose.model('Officers', OfficerSchema)
