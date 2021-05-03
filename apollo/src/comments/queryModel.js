import mongoose from 'mongoose';

const { Schema } = mongoose;

const querySchema = new Schema({
  searchTerm: String,
  matchedCount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
