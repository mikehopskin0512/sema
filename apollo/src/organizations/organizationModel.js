import mongoose from 'mongoose';
import { createOrganizationCollection, getDefaultCollections } from '../comments/collections/collectionService';

const organizationSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  avatarUrl: String,
  description: String,
  collections: [{
    collectionData: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    isActive: { type: Boolean, default: true },
  }],
  users: [String],
  repos: [{
    type: Schema.Types.ObjectId,
    ref: 'Repository',
  }],
  provider: {
    name: String,
    id: String,
  },
  url: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

organizationSchema.pre('save', async function save(next) {
  // TODO:tto
  try {
    if(this.isNew) {
      this._id = new ObjectId();
      const organizationCollection = await createOrganizationCollection(this);
      this.collections = await getDefaultCollections(organizationCollection._id);
    }
    if (!this.url) {
      this.url = this._id;
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Organization', organizationSchema);
