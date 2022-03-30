import mongoose from 'mongoose';

const { Schema } = mongoose;

const identitySchema = mongoose.Schema({
  provider: String,
  id: String,
  username: String,
  email: String,
  emails: [],
  firstName: String,
  lastName: String,
  profileUrl: String,
  avatarUrl: String,
  // removed as this might be unnecessary for portfolios and would just make this schema big.
  // repositories: [repositoryScheme]
}, { _id: false });

const portfolioSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  firstName: String,
  lastName: String,
  title: {
    required: true,
    maxlength: 130,
    type: String,
  },
  // TODO: should be deleted in dev portfolio v3
  headline: String,
  imageUrl: String,
  // TODO: should be deleted in dev portfolio v3
  overview: String,
  identities: [identitySchema],
  type: { type: String, enum: ['public', 'private'] },
  snapshots: [{
    id: { type: Schema.Types.ObjectId, ref: 'Snapshot' },
    sort: Number,
    _id: false,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
