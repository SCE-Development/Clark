const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GalleryImageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    faces: [{ type: Schema.Types.ObjectId, ref: 'GalleryFace' }],
  },
  { collection: 'GalleryImage' }
);

const GalleryFaceSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    top: {
      type: Number,
      required: true,
    },
    left: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  { collection: 'GalleryFace' }
);

GalleryImageSchema.query.byName = (name) => {
  return this.where({ name: new RegExp(name, 'i') });
};

module.exports.GalleryFace = mongoose.model('GalleryFace', GalleryFaceSchema);
module.exports.GalleryImage = mongoose.model(
  'GalleryImage',
  GalleryImageSchema
);
