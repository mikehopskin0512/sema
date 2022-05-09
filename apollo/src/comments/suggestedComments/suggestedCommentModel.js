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
  enteredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  lastModified: {
    type: Date,
  },
  source: {
    name: String,
    url: String,
  },
  collections: [{
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection' },
    name: String,
    type: { type: String },
  }],
  engGuides: [{
    engGuide: { type: Schema.Types.ObjectId, ref: 'EngGuide' },
    name: String,
    slug: String,
  }],
  tags: [commentTagsSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  link: { type: String },
  relatedLinks: [String],
  sourceMetadata: {
    title: String,
    icon: String,
    thumbnail: String,
  },
}, {
  timestamps: true,
  collection: 'suggestedComments',
});

suggestedCommentSchema.set('autoIndex', autoIndex);
suggestedCommentSchema.index({ title: 1 });

module.exports = mongoose.model('SuggestedComment', suggestedCommentSchema);
