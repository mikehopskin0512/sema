import mongoose from 'mongoose';
import { autoIndex } from '../config';

const organizationSchema = mongoose.Schema({
  orgName: String,
  slug: { type: String, unique: true, lowercase: true },
  legacyId: String,
}, { timestamps: true });

organizationSchema.set('autoIndex', autoIndex);
organizationSchema.index({ orgName: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
