import mongoose from 'mongoose';
import { createTeamCollection, findByType } from '../comments/collections/collectionService';
import { COLLECTION_TYPE } from '../comments/collections/constants';

const { Schema } = mongoose;

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
    const teamCollection = await createTeamCollection(this);
    const collections = await findByType(COLLECTION_TYPE.COMMUNITY);
    this.collections = [
      { isActive: true, collectionData: teamCollection },
      ...collections,
    ];
    if (!this.url) {
      this.url = this._id;
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Team', teamSchema);
