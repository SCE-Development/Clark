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
    linkedIn: {
      type: String
    },
    github: {
      type: String
    },
    // The access level is defined as follows:
    // -2: Ban
    // -1: Pending
    // 0: Member
    // 1: Officer
    // 2: Admin
    accessLevel: {
      type: Number,
      require: true
    },
    role: {
      type: String
    },
    pictureName: {
      type: String
    },
    quote: {
      type: String
    }
  },
  { collection: 'Officers' }
)

module.exports = mongoose.model('Officers', OfficerSchema)
