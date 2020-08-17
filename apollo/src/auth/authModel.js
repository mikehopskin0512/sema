import mongoose from 'mongoose';
import { autoIndex } from '../config';

const { Schema } = mongoose;

const authSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'auth' });

authSchema.set('autoIndex', autoIndex);

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
