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
    lessons: {
      type: Array,
      default: []
    },
    imageURL: {
      type: String
    }
  },
  { collection: 'Course' }
);

module.exports = mongoose.model('Course', CourseSchema);
