// const mongoose = require('mongoose');
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PrintingForm3DSchema = new Schema(
  {
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
    },

    // unique id for query
    // id = email of the user who requested
    email: {
      type: String,
      required: true
    }
  },
  { collection: 'PrintingForm3D' }
);

export const PrintingForm3DModel = mongoose.models.PrintingForm3D || mongoose.model('PrintingForm3D', PrintingForm3DSchema);
