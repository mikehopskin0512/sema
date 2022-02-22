import mongoose from 'mongoose';
import { autoIndex } from '../../config';
import { COLLECTION_TYPE } from './constants';

const { Schema } = mongoose;

const collectionSchema = new Schema({
  name: { $type: String, required: true },
  description: String,
  tags: [{
    tag: { $type: Schema.Types.ObjectId, ref: 'Tag' },
    type: String,
    label: String,
  }],
  type: {
    $type: String,
    enum: Object.values(COLLECTION_TYPE),
  },
  comments: [{ $type: Schema.Types.ObjectId, ref: 'suggestedComment' }],
  author: { $type: String },
  isActive: { $type: Boolean, default: true },
  source: {
    name: String,
    url: String,
  },
  createdAt: { $type: Date, default: Date.now },
  createdBy: { $type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, collection: 'collections', typeKey: '$type' });

collectionSchema.set('autoIndex', autoIndex);
collectionSchema.index({ name: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
