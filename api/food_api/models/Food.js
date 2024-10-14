const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodsSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    photo: {
      type: String,
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    expiration: {
      type: Date
    }
  },
  { collection: 'Foods' }
);

module.exports = mongoose.model('Foods', FoodsSchema);