import mongoose from 'mongoose';
import { autoIndex } from '../../config';

const { Schema } = mongoose;

const commentSourceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'commentSources',
});

commentSourceSchema.set('autoIndex', autoIndex);
commentSourceSchema.index({ title: 1 });

module.exports = mongoose.model('CommentSource', commentSourceSchema);
