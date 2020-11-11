const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    link: {
        type: String,
        required: true
    }
  },
  { collection: "Lesson" }
);

module.exports = mongoose.model("Lesson", LessonSchema);