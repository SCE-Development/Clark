const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DEFAULT_PHOTO_URL } = require('../../util/constants');

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    eventLocation: {
      type: String,
      required: true
    },
    eventDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    eventCategory: {
      type: String
    },

    imageURL: {
      type: String,
      default: 'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG'
    }
  },
  { collection: 'Event' }
);

module.exports = mongoose.model('Event', EventSchema);
