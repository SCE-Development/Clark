const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AbilitySchema = new Schema(
  {
    abilityID: {
      type: Number,
      required: true
    },
    abilityName: {
      type: String,
      required: true
    },
    abilityDescription: {
      type: String,
      required: true
    }
  },
  { collection: 'Ability' }
)

module.exports = mongoose.model('Ability', AbilitySchema)
