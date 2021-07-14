import mongoose from 'mongoose';

const { Schema } = mongoose;

const tagSchema = new Schema({
  label: String,
  sentiment: { type: String, enum: ['positive', 'negative'] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);
