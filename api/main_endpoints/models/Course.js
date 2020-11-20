const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DEFAULT_PHOTO_URL } = require('../../util/constants');

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageURL: {
      type: String
    },
    lessons: {
      type: Array,
      default: []
    }
  },
  { collection: 'Course' }
);

module.exports = mongoose.model('Course', CourseSchema);
