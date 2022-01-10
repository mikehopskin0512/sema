import mongoose from 'mongoose';
import { createTeamCollection } from '../comments/collections/collectionService';

const { Schema } = mongoose;

const teamSchema = new Schema({
  name: { type: String, required: true },
  avatarUrl: String,
  description: String,
  collections: [{
    type: Schema.Types.ObjectId,
    ref: 'Collection',
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

teamSchema.pre('save', async function save(next) {
  try {
    const teamCollection = await createTeamCollection(this);
    this.collections = [teamCollection];
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Team', teamSchema);
