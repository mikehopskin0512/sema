import mongoose from 'mongoose';
import { autoIndex } from '../../config';

const { Schema } = mongoose;

const suggestedCommentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    ref: 'CommentSource',
  },
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
