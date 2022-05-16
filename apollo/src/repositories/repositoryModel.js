import mongoose from 'mongoose';
import { autoIndex } from '../config';

const tagsScheme = new mongoose.Schema(
  {
    tagsId: [String],
    smartCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SmartComment',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {}
);

const reactionsScheme = new mongoose.Schema(
  {
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reaction',
      required: true,
    },
    smartCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SmartComment',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {}
);

const repoStatsSchema = new mongoose.Schema(
  {
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reactions: [reactionsScheme],
    tags: [tagsScheme],
    smartCodeReviews: { type: Number, default: 0 },
    smartComments: { type: Number, default: 0 },
    smartCommenters: { type: Number, default: 0 },
    semaUsers: { type: Number, default: 0 },
  },
  { _id: false }
);

const repositoriesSchema = new mongoose.Schema(
  {
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
    name: String,
    description: String,
    externalId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['github', 'bitbucket', 'direct'],
    },
    // The GitHub installation ID for repo sync
    installationId: {
      type: String,
    },
    sync: {
      status: {
        type: String,
        enum: ['pending', 'started', 'completed'],
        default: 'pending',
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    repositoryCreatedAt: Date,
    repositoryUpdatedAt: Date,
    legacyId: String,
    cloneUrl: String,
    language: String,
    repoStats: {
      type: repoStatsSchema,
      default: {},
    },
  },
  { timestamps: true }
);

repositoriesSchema.set('autoIndex', autoIndex);
repositoriesSchema.index({ orgId: 1, externalId: 1 });

// { type, externalId } should be unique.
repositoriesSchema.index(
  { type: 1, externalId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: { $exists: true },
      externalId: { $exists: true },
    },
  }
);

export default mongoose.model('Repository', repositoriesSchema);
