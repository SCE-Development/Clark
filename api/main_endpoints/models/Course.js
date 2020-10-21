const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DEFAULT_PHOTO_URL } = require("../../util/constants");

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String
    },
    description: {
      type: String
    },
    link: {
        type: String,
        required: true
    }
  },
  { collection: "Course" }
);

module.exports = mongoose.model("Course", CourseSchema);
