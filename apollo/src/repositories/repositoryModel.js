import mongoose from 'mongoose';
import Bluebird from 'bluebird';
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
          lastUpdatedAt: Date,
        },
        pullRequestReview: {
          currentPage: Number,
          lastPage: Number,
          lastUpdatedAt: Date,
        },
        issueComment: {
          currentPage: Number,
          lastPage: Number,
          lastUpdatedAt: Date,
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

repositoriesSchema.methods.updateRepoStats = async function updateRepoStats() {
  const { reactions, tags } = await getReactionsAndTags(this._id);
  const update = await Bluebird.props({
    'repoStats.smartCodeReviews': getPullRequestCount(this._id),
    'repoStats.smartComments': getSmartCommentCount(this._id),
    'repoStats.smartCommenters': getCommenterCount(this._id),
    'repoStats.semaUsers': getCommenterCount(this._id),
    'repoStats.reactions': reactions,
    'repoStats.tags': tags,
  });

  await mongoose.model('Repository').updateOne({ _id: this._id }, update);
};

export async function getSmartCommentCount(repositoryId) {
  return await mongoose.model('SmartComment').countDocuments({ repositoryId });
}

export async function getPullRequestCount(repositoryId) {
  const [{ count } = { count: 0 }] = await mongoose
    .model('SmartComment')
    .aggregate([
      { $match: { repositoryId } },
      { $group: { _id: '$githubMetadata.pull_number' } },
      { $count: 'count' },
    ]);
  return count;
}

export async function getCommenterCount(repositoryId) {
  const [{ count } = { count: 0 }] = await mongoose
    .model('SmartComment')
    .aggregate([
      { $match: { repositoryId, userId: { $ne: null } } },
      { $group: { _id: '$userId' } },
      { $count: 'count' },
    ]);
  return count;
}

export async function getReactionsAndTags(repositoryId) {
  const comments = await mongoose
    .model('SmartComment')
    .find({ repositoryId })
    .select('reaction tags createdAt')
    .lean();

  const tags = comments.map((comment) => ({
    createdAt: comment.createdAt,
    tagsId: comment.tags ? comment.tags.map((tag) => tag._id.toString()) : [],
    smartCommentId: comment._id,
  }));

  const reactions = comments.map((comment) => ({
    createdAt: comment.createdAt,
    reactionId: comment.reaction._id,
    smartCommentId: comment._id,
  }));

  return { tags, reactions };
}

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
