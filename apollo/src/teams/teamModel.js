import mongoose from 'mongoose';
import { createTeamCollection } from '../comments/collections/collectionService';

const { Schema } = mongoose;

const teamSchema = new Schema({
  name: { type: String, required: true },
  avatarUrl: String,
  description: String,
  collections: [{
    collectionData: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    isActive: { type: Boolean, default: true },
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

teamSchema.pre('save', async function save(next) {
  try {
    const teamCollection = await createTeamCollection(this);
    this.collections = [{ isActive: true, collectionData: teamCollection }];
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Team', teamSchema);
