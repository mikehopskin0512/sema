import mongoose from 'mongoose';

import { refreshTokenExpiration } from '../config';

const { Schema } = mongoose;

const refreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, unique: true, required: true },
}, { collection: 'refreshTokens', timestamps: true });

refreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: refreshTokenExpiration });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
