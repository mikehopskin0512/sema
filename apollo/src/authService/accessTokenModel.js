import mongoose from 'mongoose';
import { autoIndex } from '../../config';

const { Schema } = mongoose;

// AccessToken -  token (type of bearer), issued to the client application, limited by time.
const accessTokenSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    unique: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'accessTokens' });

accessTokenSchema.set('autoIndex', autoIndex);

const AccessToken = mongoose.model('AccessToken', accessTokenSchema);

module.exports = AccessToken;
