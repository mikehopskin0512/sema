import Bluebird from 'bluebird';
import mongoose from 'mongoose';
import logger from '../../shared/logger';
import { findByExternalId } from '../../repositories/repositoryService';
import Repository from '../../repositories/repositoryModel';
import { EMOJIS_ID } from '../suggestedComments/constants';
import {
  addRepositoryToIdentity,
  findById as findUserById,
} from '../../users/userService';

const {
  Types: { ObjectId },
} = mongoose;
const { Schema } = mongoose;

const githubMetadataSchema = new Schema({
  url: String,
  pull_number: String,
  repo_id: String,
  repo: String,
  head: String,
  base: String,
  requester: String,
  requesterAvatarUrl: String,
  clone_url: String,
  user: { id: String, login: String },
  filename: { type: String, default: null },
  file_extension: { type: String, default: null },
  line_numbers: { type: Array, default: [] },
  title: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  id: String,
  type: {
    type: String,
    enum: ['pullRequestComment', 'issueComment', 'pullRequestReview'],
  },
  commentId: String,
  organization: { type: String, default: null },
});

const smartCommentSchema = new Schema(
  {
    comment: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository' },
    location: { type: String, enum: ['conversation', 'files changed'] },
    suggestedComments: [
      { type: Schema.Types.ObjectId, ref: 'SuggestedComment' },
    ],
    reaction: { type: Schema.Types.ObjectId, ref: 'Reaction', required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    githubMetadata: githubMetadataSchema,
    source: {
      origin: {
        type: String,
        enum: ['extension', 'repoSync'],
        default: 'extension',
      },
      provider: {
        type: String,
        enum: ['github'],
        default: 'github',
      },
      // Unique identifier in the context of this provider.
      id: String,
      // Date of creation in the source.
      createdAt: Date,
    },
  },
  { collection: 'smartComments', timestamps: true }
);

smartCommentSchema.pre('validate', function setDefaultReaction() {
  if (!this.reaction) this.reaction = ObjectId(EMOJIS_ID.NO_REACTION);
});

smartCommentSchema.pre('save', async function setRepository() {
  if (this.repositoryId) return;
  this.repositoryId = (await findOrCreateRepository(this))._id;
});

smartCommentSchema.pre('save', function setGitHubDefaults() {
  const { source } = this;
  const { githubMetadata } = this;

  if (source.provider !== 'github') return;

  this.source.createdAt = githubMetadata.created_at;

  if (source.origin === 'extension') {
    const shouldInferIds =
      !source.id && !source.type && githubMetadata.commentId;
    if (shouldInferIds) {
      const { type, id } = getIdAndType(githubMetadata);
      if (type && id) {
        this.githubMetadata.type = type;
        this.githubMetadata.id = id;
        this.source.id = `${type}:${id}`;
      }
    }
  }

  const commentId = getCommentId(githubMetadata);
  if (commentId) this.githubMetadata.commentId = commentId;
});

smartCommentSchema.post('save', async function addRepositoryToUser() {
  const { userId } = this;
  const user = userId && (await findUserById(userId));
  if (!user) return;

  const repository = await Repository.findById(this.repositoryId);

  const repoData = {
    name: repository.name,
    id: repository.externalId,
    fullName: repository.fullName,
    githubUrl: repository.cloneUrl,
  };
  await addRepositoryToIdentity(user, repoData);
  await repository.updateOne({ $addToSet: { 'repoStats.userIds': user._id } });
});

smartCommentSchema.post('save', async function updateRepoStats() {
  const update = await Bluebird.props({
    'repoStats.smartCodeReviews': getPullRequestCount(this.repositoryId),
    'repoStats.smartComments': getSmartCommentCount(this.repositoryId),
    'repoStats.smartCommenters': getCommenterCount(this.repositoryId),
    'repoStats.semaUsers': getCommenterCount(this.repositoryId),
  });
  await mongoose.model('Repository').updateOne(update);
});

smartCommentSchema.post('save', async function updateRepoStats() {
  const repository = await Repository.findById(this.repositoryId);
  const tagsId = this.tags?.map((tag) => tag._id.toString());

  await Promise.all([
    await repository.findOrCreateInArray(
      'repoStats.reactions',
      { smartCommentId: this._id },
      { createdAt: this.createdAt, reactionId: this.reaction._id }
    ),
    await repository.findOrCreateInArray(
      'repoStats.tags',
      { smartCommentId: this._id },
      { tagsId, createdAt: this.createdAt }
    ),
  ]);
});

async function getSmartCommentCount(repositoryId) {
  return await mongoose.model('SmartComment').countDocuments({ repositoryId });
}

async function getPullRequestCount(repositoryId) {
  const [{ count }] = await mongoose
    .model('SmartComment')
    .aggregate([
      { $match: { repositoryId } },
      { $group: { _id: '$githubMetadata.pull_number' } },
      { $count: 'count' },
    ]);
  return count;
}

async function getCommenterCount(repositoryId) {
  const [{ count }] = await mongoose
    .model('SmartComment')
    .aggregate([
      { $match: { repositoryId, userId: { $ne: null } } },
      { $group: { _id: '$userId' } },
      { $count: 'count' },
    ]);
  return count;
}

smartCommentSchema.index(
  { 'source.provider': 1, 'source.id': 1 },
  {
    unique: true,
    partialFilterExpression: {
      'source.provider': { $exists: true },
      'source.id': { $exists: true },
    },
  }
);

smartCommentSchema.index({ 'repositoryId': 1, 'source.createdAt': -1 });

function getCommentId({ type, id }) {
  if (!type || !id) return null;

  switch (type) {
    case 'pullRequestComment':
      return `discussion_r${id}`;

    case 'pullRequestReview':
      return `pullrequestreview-${id}`;

    case 'issueComment':
      return `issuecomment-${id}`;

    default:
      logger.info(`Unknown type ${type}`);
      return null;
  }
}

function getIdAndType({ commentId }) {
  const [, issueCommentId] = commentId.split('issuecomment-');
  if (issueCommentId) {
    return { type: 'issueComment', id: issueCommentId };
  }

  const [, pullRequestReviewId] = commentId.split('pullrequestreview-');
  if (pullRequestReviewId) {
    return { type: 'pullRequestReview', id: pullRequestReviewId };
  }

  const [, pullRequestCommentId] = commentId.match(/r(\d+)/) || [];
  if (pullRequestCommentId) {
    return { type: 'pullRequestComment', id: pullRequestCommentId };
  }

  return {};
}

async function findOrCreateRepository(smartComment) {
  const { githubMetadata } = smartComment;
  const { repo_id: externalId } = githubMetadata;

  if (!externalId) return null;

  const existingRepository = await findByExternalId(externalId);

  if (existingRepository) return existingRepository;

  const cloneUrl = githubMetadata.clone_url || githubMetadata.url;
  const repository = await Repository.findOrCreate(
    { type: 'github', externalId },
    {
      name: smartComment.githubMetadata.repo,
      language: '',
      description: '',
      cloneUrl,
    }
  );
  return repository;
}

export default mongoose.model('SmartComment', smartCommentSchema);
