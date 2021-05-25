import mongoose from 'mongoose';

const { Schema } = mongoose;

const githubMetadataSchema = new Schema({
  url: String,
  pull_number: String,
  repo: String,
  head: String,
  base: String,
  requester: String,
  user: { id: String, login: String },
  filename: { type: String, default: null },
  file_extension: { type: String, default: null },
  line_numbers: { type: Array, default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const smartCommentSchema = new Schema({
  commentId: { type: String, unique: true },
  comment: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true, enum: ['comment', 'inline'] },
  suggestedComments: [{ type: Schema.Types.ObjectId, ref: 'SuggestedComment' }],
  reaction: { type: Schema.Types.ObjectId, ref: 'Reaction' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  githubMetadata: githubMetadataSchema,
}, { collection: 'smartComment', timestamps: true });

module.exports = mongoose.model('SmartComment', smartCommentSchema);
