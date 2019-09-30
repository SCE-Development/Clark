const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClearanceLevelSchema = new Schema(
  {
    cID: {
      type: Number,
      required: true
    },
    levelName: {
      type: String,
      required: true
    },
    abilities: {
      type: Array,
      required: true
    }
  },
  { collection: 'ClearanceLevel' }
)

module.exports = mongoose.model('ClearanceLevel', ClearanceLevelSchema)
