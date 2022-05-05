import mongoose from 'mongoose';
import { autoIndex } from '../config';

const invitationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  tokenExpires: {
    type: Date,
    required: true,
  },
  redemptions: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false,
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: false,
  },
  recipient: { type: String, required: false },
  isMagicLink: {
    type: Boolean,
    required: false,
    default: false,
  },
}, { timestamps: true });

invitationSchema.set('autoIndex', autoIndex);
invitationSchema.index({
  token: 1,
  tokenExpires: 1,
});

module.exports = mongoose.model('Invitation', invitationSchema);
