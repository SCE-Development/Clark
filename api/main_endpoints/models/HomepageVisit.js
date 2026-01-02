const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HomepageVisitSchema = new Schema(
    {
        visitCount: {
            type: Number,
            default: 0
        }
    },
    { collection: 'HomepageVisit' }
);

module.exports = mongoose.model('HomepageVisit', HomepageVisitSchema);