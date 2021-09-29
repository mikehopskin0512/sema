import mongoose from 'mongoose';
import { autoIndex } from '../../config';

const { Schema } = mongoose;

const engGuideTagsSchema = new mongoose.Schema({
  tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  type: String,
  label: String,
}, { _id: false });

const engGuideSchema = new Schema({
  displayId: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  source: { name: String, url: String },
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  tags: [engGuideTagsSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'engGuides',
});

engGuideSchema.set('autoIndex', autoIndex);
engGuideSchema.index({ title: 1 });

module.exports = mongoose.model('EngGuide', engGuideSchema);
