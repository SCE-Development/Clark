const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PrintingForm3DSchema = new Schema(
  {
    // PF3D: {
    //   type: Number
    // },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    projectType: {
      type: String
    },
    projectLink: {
      type: String
    },
    projectContact: {
      type: String,
      required: true
    },
    projectComments: {
      type: String
    },
    progress: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'PrintingForm3DSchema' }
)

module.exports = mongoose.model('PrintingForm3DSchema', PrintingForm3DSchema)
