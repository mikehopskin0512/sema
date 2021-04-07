import mongoose from 'mongoose';
import { autoIndex } from '../config';

const repositoriesSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
  name: String,
  externalId: { type: String, required: true },
  type: { type: String, required: true, enum: ['github', 'bitbucket', 'direct'] },
  repositoryCreatedAt: Date,
  repositoryUpdatedAt: Date,
  legacyId: String,
  cloneUrl: String,
}, { timestamps: true });

repositoriesSchema.set('autoIndex', autoIndex);
repositoriesSchema.index({ orgId: 1, externalId: 1 });

module.exports = mongoose.model('Repository', repositoriesSchema);
