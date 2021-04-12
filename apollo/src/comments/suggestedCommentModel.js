import mongoose from 'mongoose';
import { autoIndex } from '../config';

const { Schema } = mongoose;

const suggestedCommentSchema = new Schema({
  comment: { type: String, required: true },
  sourceName: { type: String, required: true },
  sourceUrl: { type: String, required: true },
  title: { type: String, required: true },
}, { timestamps: true });

suggestedCommentSchema.set('autoIndex', autoIndex);
suggestedCommentSchema.index({ title: 1 });

module.exports = mongoose.model('SuggestedCommen', suggestedCommentSchema);
