import mongoose from 'mongoose';
import { autoIndex } from '../config';

const sourcesSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  externalSourceId: { type: String, required: true },
  type: { type: String, required: true, enum: ['github', 'bitbucket', 'direct'] },
}, { timestamps: true });

sourcesSchema.set('autoIndex', autoIndex);

module.exports = mongoose.model('Sources', sourcesSchema);
