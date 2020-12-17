import mongoose from 'mongoose';
import { autoIndex } from '../config';

const analysisSchema = new mongoose.Schema({
  repositoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
  runId: { type: String, required: true },
  completedAt: Date,
}, { timestamps: true });

analysisSchema.set('autoIndex', autoIndex);
analysisSchema.index({ repositoryId: 1 });

module.exports = mongoose.model('Analysis', analysisSchema);
