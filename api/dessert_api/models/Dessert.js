
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DessertSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    rating: {
        type: Number,
    },
}, { collection: 'Desserts' })

module.exports = mongoose.model("Dessert", DessertSchema)