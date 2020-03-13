const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventoryItemSchema = new Schema(
  {
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    picture: {
      type: String
    }
  },
  { collection: 'InventoryItem' }
);

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
