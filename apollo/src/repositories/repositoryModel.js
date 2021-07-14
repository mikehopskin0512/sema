import mongoose from 'mongoose';
import { autoIndex } from '../config';

const repoStatsSchema = new mongoose.Schema({
  commentCount: Number
});

const repositoriesSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
  name: String,
  description: String,
  externalId: { type: String, required: true },
  type: { type: String, required: true, enum: ['github', 'bitbucket', 'direct'] },
  repositoryCreatedAt: Date,
  repositoryUpdatedAt: Date,
  legacyId: String,
  cloneUrl: String,
  language: String,
  repoStats: repoStatsSchema
}, { timestamps: true });

repositoriesSchema.set('autoIndex', autoIndex);
repositoriesSchema.index({ orgId: 1, externalId: 1 });

module.exports = mongoose.model('Repository', repositoriesSchema);
