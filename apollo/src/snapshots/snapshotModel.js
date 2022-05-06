import mongoose from 'mongoose';

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
  smartCommentId: { type: Schema.Types.ObjectId, ref: 'SmartComments' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: String,
  reaction: { type: Schema.Types.ObjectId, ref: 'Reaction' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tags' }],
  githubMetadata: githubMetadataSchema,
  createdAt: Date,
}, { _id: false });

const componentDataSchema = new Schema({
  smartComments: [smartCommentSchema],
  groupBy: { type: String, enum: ['day', 'week', 'month', 'quarter', 'year'] },
  yAxisType: String,
  dateDiff: Number,
  startDate: Date,
  endDate: Date,
}, { _id: false });

const snapshotSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  portfolios: [{
    type: Schema.Types.ObjectId,
    ref: 'Portfolio',
  }],
  componentType: {
    type: String,
    required: true,
    enum: ['comments', 'summaries', 'tags', 'summaries-area'],
  },
  componentData: componentDataSchema,
  isHorizontal: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Snapshot', snapshotSchema);
