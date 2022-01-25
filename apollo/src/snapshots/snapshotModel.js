import mongoose from 'mongoose';

import { create as createPortfolio, getPortfoliosByUser } from '../portfolios/portfolioService';
import { getUserMetadata } from '../users/userService';

const { Schema, Types: { ObjectId } } = mongoose;

const componentDataSchema = new Schema({
  comments: {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    reaction: String,
    tags: [{ type: String }],
    createdAt: Date,
    githubMetadata: {
      title: String,
      url: String,
      user: {
        login: String,
      },
      pull_number: String,
      commentId: String,
      requester: String,
    },
  },
  summaries: {
    reactions: [{ type: Schema.Types.ObjectId, ref: 'Reaction' }],
    chartType: { type: String, enum: ['line', 'bar', 'pie', 'bubble'] },
    yAxisType: String,
    groupBy: { type: String, enum: ['day', 'week', 'month', 'quarter', 'year'] },
  },
  tags: {
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    chartType: { type: String, enum: ['line', 'bar', 'pie', 'bubble'] },
    groupBy: { type: String, enum: ['day', 'week', 'month', 'quarter', 'year'] },
    tagBy: String,
  },
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
