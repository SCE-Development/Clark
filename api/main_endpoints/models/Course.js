const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    lessons: {
      type: Array
    },
    link: {
        type: String,
        required: true
    }
  },
  { collection: "Course" }
);

module.exports = mongoose.model("Course", CourseSchema);
