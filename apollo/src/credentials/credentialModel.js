import mongoose from 'mongoose';
import { autoIndex } from '../../config';

const { Schema } = mongoose;

// Client application which requests access on behalf of user
const clientSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  clientId: {
    type: String,
    unique: true,
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
    select: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

clientSchema.set('autoIndex', autoIndex);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
