import mongoose from 'mongoose';
import { createOrUpdate } from "../../repositories/repositoryService";
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
  title: String,
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

smartCommentSchema.post('save', async function(doc, next) {
  try {
    const repository = {
      externalId: doc.githubMetadata.repo_id, 
      name: doc.githubMetadata.repo, 
      language: "", 
      description: "",
      type: "github",
      cloneUrl: doc.githubMetadata.clone_url, 
      repositoryCreatedAt: "", 
      repositoryUpdatedAt: ""
    }
    const newRepository = await createOrUpdate(repository);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('SmartComment', smartCommentSchema);
