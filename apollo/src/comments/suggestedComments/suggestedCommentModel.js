import mongoose from 'mongoose';
import { autoIndex } from '../../config';

const { Schema } = mongoose;

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
    slug: String,
  }],
  tags: [{
    tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
    type: String,
    label: String,
  }],
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

suggestedCommentSchema.post('save', function (doc, next) {
  commentLibraryIndex.add(this._id, this.title);
  commentLibraryIndex.add(this._id, this.comment);
  next();
});

module.exports = mongoose.model('SuggestedComment', suggestedCommentSchema);
