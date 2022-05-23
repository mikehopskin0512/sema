import mongoose from 'mongoose';
import logger from '../../shared/logger';
import {
  createOrUpdate,
  findByExternalId,
} from '../../repositories/repositoryService';
import {
  addRepositoryToIdentity,
  findById,
  findByUsernameOrIdentity,
} from '../../users/userService';
import { getPullRequestsByExternalId } from './smartCommentService';
import { EMOJIS_ID } from '../suggestedComments/constants';

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
        return this.source.origin !== 'repoSync';
      },
    },
    location: { type: String, enum: ['conversation', 'files changed'] },
    suggestedComments: [
      { type: Schema.Types.ObjectId, ref: 'SuggestedComment' },
    ],
    reaction: { type: Schema.Types.ObjectId, ref: 'Reaction' },
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

smartCommentSchema.post('save', async (doc, next) => {
  const GITHUB_URL = 'https://github.com';
  try {
    const { NO_REACTION } = EMOJIS_ID;
    const {
      githubMetadata: { repo_id: externalId, url, requester, pull_number },
      _id,
      reaction: reactionId = NO_REACTION,
      tags: tagsIds,
      userId,
      repo,
    } = doc;

    if (externalId) {
      const user = userId && (await findById(userId));
      const { _id: requesterId = null } =
        (await findByUsernameOrIdentity(requester)) || {};

      let repository = await findByExternalId(externalId);
      const reaction = {
        smartCommentId: mongoose.Types.ObjectId(_id),
        reactionId: mongoose.Types.ObjectId(reactionId),
      };

      const tags = {
        smartCommentId: mongoose.Types.ObjectId(_id),
        tagsId: tagsIds,
      };

      if (repository) {
        // It already exists in the database, use the object for this one and upsert the reactions
        const repoReactions = repository.repoStats.reactions;
        const repoTags = repository.repoStats.tags;
        repoReactions.push(reaction);
        repoTags.push(tags);

        const repoPullRequests = await getPullRequestsByExternalId(externalId);
        if (!repoPullRequests?.includes(pull_number)) {
          repository.repoStats.smartCodeReviews += 1;
        }

        const repoUserIds =
          repository.repoStats.userIds?.map((id) => id?.toString()) || [];
        if (user && !repoUserIds.includes(userId.toString())) {
          repository.repoStats.userIds.push(userId);
          repository.repoStats.smartCommenters += 1;
          repository.repoStats.semaUsers += 1;
        }

        if (requesterId) {
          if (!repoUserIds.includes(requesterId.toString())) {
            repository.repoStats.userIds.push(requesterId);
            repository.repoStats.smartCommenters += 1;
            repository.repoStats.semaUsers += 1;
          }
        }

        repository.repoStats.smartComments += 1;
      } else {
        repository = {
          externalId,
          name: doc.githubMetadata.repo,
          language: '',
          description: '',
          type: 'github',
          cloneUrl: doc.githubMetadata.clone_url,
          repositoryCreatedAt: '',
          repositoryUpdatedAt: '',
          repoStats: {
            reactions: [reaction] || [],
            tags: [tags] || [],
            userIds: [userId] || [],
            smartCodeReviews: 1,
            smartComments: 1,
            smartCommenters: 1,
            semaUsers: 1,
          },
        };
        if (requesterId) {
          repository.repoStats.userIds.push(requesterId);
        }
      }

      await createOrUpdate(repository);

      if (user) {
        const repoData = {
          name: repo,
          id: externalId,
          fullName: url.slice(GITHUB_URL.length + 1, url.search('/pull/')),
          githubUrl: url.slice(0, url.search('/pull/')),
        };
        await addRepositoryToIdentity(user, repoData);
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
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

function getCommentId({ type, id }) {
  if (!(type && id)) return null;

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

export default mongoose.model('SmartComment', smartCommentSchema);
