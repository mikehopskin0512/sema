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
    fullName: String,
    description: String,
    externalId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['github', 'bitbucket', 'direct'],
    },
    sync: {
      status: {
        type: String,
        enum: [
          null,
          'queued',
          'started',
          'completed',
          'errored',
          'unauthorized',
        ],
        default: null,
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      queuedAt: Date,
      startedAt: Date,
      completedAt: Date,
      erroredAt: Date,
      error: String,
      progress: {
        pullRequestComment: {
          currentPage: Number,
          lastPage: Number,
        },
        pullRequestReview: {
          currentPage: Number,
          lastPage: Number,
        },
        issueComment: {
          currentPage: Number,
          lastPage: Number,
        },
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
    isPinned: Boolean,
  },
  { timestamps: true }
);

repositoriesSchema.set('autoIndex', autoIndex);
repositoriesSchema.index({ orgId: 1, externalId: 1 });

repositoriesSchema.pre('validate', function setFullNameAndCloneUrl() {
  if (!this.cloneUrl) return;

  const { cloneUrl, type, fullName } = parseCloneUrl(this.cloneUrl);
  this.type ||= type;
  this.cloneUrl = cloneUrl;
  this.fullName = fullName;
});

const parseCloneUrl = (string) => {
  const url = string.includes('@')
    ? new URL(`http://${string.replace(':', '/')}`)
    : new URL(string);

  const type = url.hostname === 'github.com' ? 'github' : null;

  if (!type) throw new Error('Unknown URL type');

  const parts = url.pathname.split('/');
  const owner = parts[1];
  const repo = parts[2].replace('.git', '');
  const fullName = `${owner}/${repo}`;
  const cloneUrl = `https://github.com/${owner}/${repo}`;
  return {
    cloneUrl,
    type,
    owner,
    repo,
    fullName,
  };
};

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
