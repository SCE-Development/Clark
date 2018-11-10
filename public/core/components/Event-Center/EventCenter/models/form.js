const mongoose = require('mongoose')

// define schema for forms 
const Form = new mongoose.Schema({

    // all action takes place heres
    status: {type: String, default: "draft"},
    eventName: {type:String, trim:true, default: ''},
    eventDescription: {type:String, trim:true, default: ''},
    eventDate: {type:String, trim:true, default: ''},
    eventTime: {type:String, trim:true, default: ''},
    eventLocation: {type:String, trim:true, default: ''},
    eventHost: {type:String, trim:true, default: ''},
    eventContact: {type:String, trim:true, default: ''}

});

module.exports = mongoose.model('Form', Form)