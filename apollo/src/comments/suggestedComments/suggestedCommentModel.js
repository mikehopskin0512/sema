import mongoose from 'mongoose';
import { autoIndex } from '../../config';

const { Schema } = mongoose;

const commentTagsSchema = new mongoose.Schema({
  tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  type: String,
  label: String,
}, { _id: false });

const suggestedCommentSchema = new Schema({
  displayId: {
    type: String,
  },
  title: {
    type: String,
    // required: true,
  },
  comment: {
    type: String,
    // required: true,
  },
  author: {
    type: String,
  },
  source: { name: String, url: String },
  engGuides: [{
    engGuide: { type: Schema.Types.ObjectId, ref: 'EngGuide' },
    name: String,
    url: String,
  }],
  tags: [commentTagsSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'suggestedComments',
});

suggestedCommentSchema.set('autoIndex', autoIndex);
suggestedCommentSchema.index({ title: 1 });

module.exports = mongoose.model('SuggestedComment', suggestedCommentSchema);
