import mongoose from 'mongoose';

const { Schema } = mongoose;

const portfolioSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  headline: String,
  imageUrl: String,
  overview: String,
  type: { type: String, enum: ['public', 'private'] },
  snapshots: [{
    id: { type: Schema.Types.ObjectId, ref: 'Snapshot' },
    sort: Number,
    _id: false,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
