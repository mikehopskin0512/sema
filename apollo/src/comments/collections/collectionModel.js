import mongoose from 'mongoose';

import { autoIndex } from '../../config';
import { COLLECTION_TYPE } from './constants';
import updateSnippetCollections from '../suggestedComments/suggestedCommentService';

const { Schema } = mongoose;

const collectionSchema = new Schema({
  name: { $type: String, required: true },
  description: String,
  isActiveByDefault: Boolean,
  tags: [{
    tag: { $type: Schema.Types.ObjectId, ref: 'Tag' },
    type: String,
    label: String,
  }],
  type: {
    $type: String,
    enum: Object.values(COLLECTION_TYPE),
  },
  organizationId: { $type: Schema.Types.ObjectId, ref: 'Organization' },
  comments: [{ $type: Schema.Types.ObjectId, ref: 'SuggestedComment' }],
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

collectionSchema.post('save', async (doc, next) => {
  try {
    const { _id: collectionId, name, comments: snippets } = doc;
    await Promise.all(snippets.map(async (id) => {
      const collection = { collectionId, name };
      await updateSnippetCollections(id, collection);
    }));
  } catch (error) {
    next(error);
  }
  next();
});

module.exports = mongoose.model('Collection', collectionSchema);
