import mongoose from 'mongoose';
import { buildReactionsSchema } from '../comments/reaction/reactionService';
import { getAllTagIds } from '../comments/tags/tagService';
import { autoIndex } from '../config';

const tagsScheme = new mongoose.Schema({
  tagsId: [String],
  smartCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'SmartComment', required: true },
}, { _id: false });

const reactionsScheme = new mongoose.Schema({
  reactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reaction', required: true },
  smartCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'SmartComment', required: true },
}, { _id: false });

const aggregationSchema = new mongoose.Schema({

}, { _id: false, strict: false });

const repoStatsSchema = new mongoose.Schema({
  reactions: aggregationSchema,
  tags: aggregationSchema,
  rawReactions: [reactionsScheme],
  rawTags: [tagsScheme],
  userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { _id: false });

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
