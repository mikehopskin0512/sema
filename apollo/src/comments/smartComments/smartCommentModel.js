import mongoose from 'mongoose';

const { Schema } = mongoose;

const githubMetadaSchema = new Schema({
  commitId: String,
  userId: String,
  body: String,
  pullRequestUrl: String,
  filePath: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const smartCommentSchema = new Schema({
  comment: String,
  suggestedComments: [{ type: Schema.Types.ObjectId, ref: 'SuggestedComment' }],
  reaction: { type: Schema.Types.ObjectId, ref: 'Reaction' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  githubMetada: githubMetadaSchema,
}, { timestamps: true });

module.exports = mongoose.model('SmartComment', smartCommentSchema);
