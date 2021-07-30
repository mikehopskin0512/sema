import mongoose from 'mongoose';
import { autoIndex } from '../../config';

const { Schema } = mongoose;

const collectionSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  tags: [{
    tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
    type: String,
    label: String,
  }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'suggestedComment' }],
  author: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true, collection: 'collections' });

collectionSchema.set('autoIndex', autoIndex);
collectionSchema.index({ name: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
