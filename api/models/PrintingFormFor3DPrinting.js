const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PrintingFormFor3DPrintingSchema = new Schema(
  {
    // PF3D: {
    //   type: Number,
    //   required: true
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
  { collection: 'PrintingFormFor3DPrinting' }
)

module.exports = mongoose.model(
  'PrintingFormFor3DPrinting',
  PrintingFormFor3DPrintingSchema
)
