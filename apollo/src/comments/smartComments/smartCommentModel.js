import mongoose from 'mongoose';
import logger from '../../shared/logger';
import { findByExternalId } from '../../repositories/repositoryService';
import Repository from '../../repositories/repositoryModel';
import { EMOJIS_ID } from '../suggestedComments/constants';
import { addRepositoryToIdentity } from '../../users/userService';

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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // Comments created from repo sync may reference
      // a user in our database if the comment author
      // exists in Sema.
      required() {
        // Temporarily allowing old documents to be saved,
        // see https://semalab.atlassian.net/browse/DESIGN-830
        if (!this.isNew) return false;

        return this.source.origin !== 'sync';
      },
    },
    repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository' },
    location: { type: String, enum: ['conversation', 'files changed'] },
    suggestedComments: [
      { type: Schema.Types.ObjectId, ref: 'SuggestedComment' },
    ],
    reaction: {
      type: Schema.Types.ObjectId,
      ref: 'Reaction',
      required: true,
      default: ObjectId(EMOJIS_ID.NO_REACTION),
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    githubMetadata: githubMetadataSchema,
    source: {
      origin: {
        type: String,
        enum: ['extension', 'sync'],
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
    analyzedAt: {
      type: Date,
      default: null,
    },
  },
  { collection: 'smartComments', timestamps: true }
);

smartCommentSchema.pre('save', async function setRepository() {
  if (this.repositoryId) return;
  const repository = await findOrCreateRepository(this);
  if (repository) this.repositoryId = repository._id;
  else logger.error(`Could not find repository for smart comment ${this._id}`);
});

smartCommentSchema.pre('save', function setGitHubDefaults() {
  const { source } = this;
  const { githubMetadata } = this;

  if (source.provider !== 'github') return;

  this.source.createdAt = githubMetadata.created_at;

  if (source.origin === 'extension') {
    const shouldInferIds = !source.id && githubMetadata.commentId;
    if (shouldInferIds) {
      const { type, id } = getIdAndType(githubMetadata);
      if (type && id) {
        this.githubMetadata.type = type;
        this.githubMetadata.id = id;
      }
    }

    if (!source.id && githubMetadata.type && githubMetadata.id)
      this.source.id = `${githubMetadata.type}:${githubMetadata.id}`;
  }

  const commentId = getCommentId(githubMetadata);
  if (commentId) this.githubMetadata.commentId = commentId;
});

smartCommentSchema.post('save', async function addRepositoryToUser() {
  if (!this.repositoryId) return;
  if (!this.userId) return;

  const repository = this.populated('repositoryId')
    ? this.repositoryId
    : await Repository.findById(this.repositoryId).select('-repoStats');

  await addRepositoryToIdentity(this.userId, repository);
});

smartCommentSchema.post('save', async function updateRepoStats() {
  if (!this.repositoryId) return;
  if (this.source?.origin === 'sync') return;

  const repository = await mongoose
    .model('Repository')
    .findById(this.repositoryId);
  await repository.updateRepoStats();
});

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

// This is for analyzing comments using a background job.
smartCommentSchema.index(
  { 'analyzedAt': 1, 'source.origin': 1 },
  {
    partialFilterExpression: {
      'analyzedAt': { $type: 'null' },
      'source.origin': 'sync',
    },
  }
);

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
