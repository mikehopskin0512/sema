import mongoose from 'mongoose';

import { refreshTokenExpiration } from '../config';

const { Schema } = mongoose;

const refreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, unique: true, required: true },
}, { timestamps: true });

refreshTokenSchema.createIndex({ createdAt: 1 }, { expireAfterSeconds: refreshTokenExpiration });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
