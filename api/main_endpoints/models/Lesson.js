const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DEFAULT_PHOTO_URL } = require("../../util/constants");

const LessonSchema = new Schema(
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
  { collection: "Lesson" }
);

module.exports = mongoose.model("Lesson", LessonSchemas);