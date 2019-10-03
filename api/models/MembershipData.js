const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MembershipDataSchema = new Schema(
  {
    memberID: {
      type: Number,
      required: true
    },
    startTerm: {
      type: String
    },
    endTerm: {
      type: String
    },
    doorCodeID: {
      type: String
    },
    gradDate: {
      type: String
    },
    level: {
      type: Number,
      required: true
    },
    membershipStatus: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { collection: 'MembershipData' }
)

module.exports = mongoose.model('MembershipData', MembershipDataSchema)
