const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DessertsSchema = new Schema (
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    rating: {
      type: Number
    }
  },
  {collection: 'Desserts'}
);

module.exports = mongoose.model('Desserts', DessertsSchema);
