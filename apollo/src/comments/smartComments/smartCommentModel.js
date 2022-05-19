import mongoose from 'mongoose';
import { createOrUpdate, findByExternalId } from "../../repositories/repositoryService";
import { addRepositoryToIdentity, findById, findByUsernameOrIdentity } from '../../users/userService';
import {getPullRequestsByExternalId} from "./smartCommentService";

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
  commentId: String,
  clone_url: String,
  user: { id: String, login: String },
  filename: { type: String, default: null },
  file_extension: { type: String, default: null },
  line_numbers: { type: Array, default: [] },
  title: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const smartCommentSchema = new Schema({
  comment: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, enum: ['conversation', 'files changed'] },
  suggestedComments: [{ type: Schema.Types.ObjectId, ref: 'SuggestedComment' }],
  reaction: { type: Schema.Types.ObjectId, ref: 'Reaction' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  githubMetadata: githubMetadataSchema,
}, { collection: 'smartComments', timestamps: true });

smartCommentSchema.post('save', async function (doc, next) {
  const GITHUB_URL = 'https://github.com';
  try {
    const noReactionEmojiId = "607f0d1ed7f45b000ec2ed70";
    const { githubMetadata: { repo_id: externalId, url, requester, pull_number }, _id, reaction: reactionId = noReactionEmojiId, tags: tagsIds, userId, repo } = doc;

    if (externalId) {
      const user = await findById(userId);
      const { _id: requesterId = null } = await findByUsernameOrIdentity(requester) || {};

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

        const repoUserIds = repository.repoStats.userIds?.map((id) => id?.toString()) || [];
        if (!repoUserIds.includes(userId.toString())) {
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
          language: "",
          description: "",
          type: "github",
          cloneUrl: doc.githubMetadata.clone_url,
          repositoryCreatedAt: "",
          repositoryUpdatedAt: "",
          repoStats: {
            reactions: [
              reaction
            ] || [],
            tags: [
              tags
            ] || [],
            userIds: [
              userId
            ] || [],
            smartCodeReviews: 1,
            smartComments: 1,
            smartCommenters: 1,
            semaUsers: 1,
          }
        }
        if (requesterId) {
          repository.repoStats.userIds.push(requesterId);
        }
      }

      const newRepository = await createOrUpdate(repository);
      // eslint-disable-next-line max-len
      const repoData = { name: repo, id: externalId, fullName: url.slice(GITHUB_URL.length + 1, url.search('/pull/')), githubUrl: url.slice(0, url.search('/pull/')) };
      await addRepositoryToIdentity(user, repoData);
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('SmartComment', smartCommentSchema);
