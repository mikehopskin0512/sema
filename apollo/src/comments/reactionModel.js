import mongoose from 'mongoose';

const { Schema } = mongoose;

const reactionSchema = new Schema({
  title: { type: String, required: true },
  emoji: { type: String, required: true },
  githubEmoji: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Reaction', reactionSchema);
