const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
  company: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  }
});

const AlumniSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bio: {
      type: String,
      default: ''
    },
    headline: {
      type: String,
      default: ''
    },
    profilePhotoUrl: {
      type: String,
      default: ''
    },
    linkedInUrl: {
      type: String,
      default: ''
    },
    startYear: {
      type: Number
    },
    graduationYear: {
      type: Number
    },
    degree: {
      type: String,
      enum: ['BS', 'MS'],
      default: ''
    },
    experiences: {
      type: [ExperienceSchema],
      default: []
    }
  },
  {
    collection: 'AlumniProfile',
    timestamps: true
  }
);

module.exports =
  mongoose.models && mongoose.models.Alumni
    ? mongoose.models.Alumni
    : mongoose.model('Alumni', AlumniSchema);
