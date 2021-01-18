const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true
    },
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
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    link: {
      type: String,
      required: true
    }
  },
  { collection: "Course" }
);

module.exports = mongoose.model("Lesson", LessonSchema);
module.exports = mongoose.model("Course", CourseSchema);
