import mongoose from 'mongoose';

import { create as createPortfolio, getPortfoliosByUser } from '../portfolios/portfolioService';
import { getUserMetadata } from '../users/userService';

const { Schema } = mongoose;

const smartCommentSchema = new Schema({
  smartCommentId: { type: Schema.Types.ObjectId, ref: 'SmartComments' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  reaction: { type: Schema.Types.ObjectId, ref: 'Reaction' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tags' }],
  githubMetadata: {
    url: String,
    repo: String,
    user: {
      login: String,
    },
    pull_number: String,
    requester: String,
  },
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
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  componentType: {
    type: String,
    required: true,
    enum: ['comments', 'summaries', 'tags'],
  },
  componentData: componentDataSchema,

}, { timestamps: true });

snapshotSchema.post('save', async (doc, next) => {
  try {
    const { _id: snapshotId, userId } = doc;
    const userPorfolios = await getPortfoliosByUser(userId);
    // User does not have a portfolio
    if (userPorfolios?.length === 0) {
      const user = await getUserMetadata(userId);
      await createPortfolio({
        userId,
        headline: `${user.firstName} ${user.lastName}`.trim(),
        imageUrl: user.avatarUrl,
        overview: '',
        type: 'public',
        snapshots: [{ id: snapshotId, sort: 0 }],
      });
    }
  } catch(error) {
    next(error)
  }
  next();
});

module.exports = mongoose.model('Snapshot', snapshotSchema);
