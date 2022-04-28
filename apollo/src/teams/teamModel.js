import mongoose from 'mongoose';
import { createTeamCollection, getDefaultCollections } from '../comments/collections/collectionService';

const { Schema, Types: { ObjectId }  } = mongoose;

const teamSchema = new Schema({
  name: { type: String, required: true },
  avatarUrl: String,
  description: String,
  collections: [{
    collectionData: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    isActive: { type: Boolean, default: true },
  }],
  repos: [{
    type: Schema.Types.ObjectId,
    ref: 'Repository',
  }],
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

teamSchema.pre('save', async function save(next) {
  try {
    if(this.isNew) {
      this._id = new ObjectId();
      const teamCollection = await createTeamCollection(this);
      this.collections = await getDefaultCollections(teamCollection._id);
    }
    if (!this.url) {
      this.url = this._id;
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Team', teamSchema);
