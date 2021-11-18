import mongoose from 'mongoose';
import { bulkUpdateUserCollections } from '../../users/userService';
import { autoIndex } from '../../config';

const { Schema } = mongoose;

const collectionSchema = new Schema({
  name: { $type: String, required: true },
  description: String,
  tags: [{
    tag: { $type: Schema.Types.ObjectId, ref: 'Tag' },
    type: String,
    label: String,
  }],
  comments: [{ $type: Schema.Types.ObjectId, ref: 'suggestedComment' }],
  author: { $type: String },
  isActive: { $type: Boolean, default: true },
  source: {
    name: String,
    url: String,
  },
  createdAt: { $type: Date, default: Date.now },
  createdBy: { $type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, collection: 'collections', typeKey: '$type' });

collectionSchema.set('autoIndex', autoIndex);
collectionSchema.index({ name: 1 });

collectionSchema.post('insertMany', async (doc) => {
  doc.forEach(async (document) => {
    if (document.author === 'sema') {
      bulkUpdateUserCollections(document)
    }
    if (document.createdBy) {
      bulkUpdateUserCollections(document, [document.createdBy])
    }
  })
});

module.exports = mongoose.model('Collection', collectionSchema);
