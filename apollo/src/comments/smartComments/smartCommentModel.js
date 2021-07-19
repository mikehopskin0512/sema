import mongoose from 'mongoose';
import { createOrUpdate, findByExternalId } from "../../repositories/repositoryService";
import { addRepositoryToIdentity, findById } from '../../users/userService';
import { buildReactionsEmptyObject, incrementReactions } from '../reaction/reactionService';
import { buildTagsEmptyObject, incrementTags } from '../tags/tagService';
const { Schema } = mongoose;

const githubMetadataSchema = new Schema({
  url: String,
  pull_number: String,
  repo_id: String,
  repo: String,
  head: String,
  base: String,
  requester: String,
  commentId: String,
  clone_url: String,
  user: { id: String, login: String },
  filename: { type: String, default: null },
  file_extension: { type: String, default: null },
  line_numbers: { type: Array, default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const smartCommentSchema = new Schema({
  comment: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, enum: ['conversation', 'files changed'] },
  suggestedComments: [{ type: Schema.Types.ObjectId, ref: 'SuggestedComment' }],
  reaction: { type: Schema.Types.ObjectId, ref: 'Reaction' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  githubMetadata: githubMetadataSchema,
}, { collection: 'smartComments', timestamps: true });

smartCommentSchema.post('save', async function (doc, next) {
  const GITHUB_URL = 'https://github.com';
  try {
    const { githubMetadata: { repo_id: externalId, url }, _id, reaction: reactionId, tags: tagsIds, userId, repo } = doc;
    console.log(doc);
    if (externalId) {
      const user = await findById(userId);
      let repository = await findByExternalId(externalId);
      const reaction = {
        smartCommentId: mongoose.Types.ObjectId(_id),
        reactionId: mongoose.Types.ObjectId(reactionId)
      };

      const tags = {
        smartCommentId: mongoose.Types.ObjectId(_id),
        tagsId: tagsIds
      }

      if (repository) {
        // It already exists in the database, use the object for this one and upsert the reactions
        const repoReactions = repository.repoStats.rawReactions;
        const repoTags = repository.repoStats.rawTags;
        repoReactions.push(reaction);
        repoTags.push(tags);
        const aggregatedTags = incrementTags(repository.repoStats.tags, tagsIds)
        repository.repoStats.tags = aggregatedTags;
        repository.repoStats.reactions = incrementReactions(repository.repoStats.reactions, reactionId);
        const idExists = repository.repoStats.userIds.some(function (id) {
          return id.equals(userId);
        });
        if (!idExists) {
          repository.repoStats.userIds.push(userId);
        }
      } else {
        const reactionObj = await buildReactionsEmptyObject();
        const tagsObj = await buildTagsEmptyObject();
        const aggregatedTags = incrementTags(tagsObj, tagsIds)
        const aggregatedReactions = incrementReactions(reactionObj, reactionId);

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
            tags: {
              ...aggregatedTags
            },
            reactions: {
              ...aggregatedReactions
            },
            rawReactions: [
              reaction
            ],
            rawTags: [
              tags
            ],
            userIds: [
              userId
            ],
          }
        }
      }
      
      const newRepository = await createOrUpdate(repository);
      const repoData = { name: repo, id: externalId, fullName: url.slice(GITHUB_URL.length + 1, url.search('/pull/')), githubUrl: url.slice(0, url.search('/pull/')) }
      await addRepositoryToIdentity(user, repoData);
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('SmartComment', smartCommentSchema);
