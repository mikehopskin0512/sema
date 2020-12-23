import mongoose from 'mongoose';
import { autoIndex } from '../config';

const invitationSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: String,
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  orgName: String,
  token: { type: String, unique: true, required: true },
  tokenExpires: { type: Date, required: true },
  numAvailable: { type: Number, min: 1, max: 1000, default: 1 },
  redemptions: [{
    _id: false,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

invitationSchema.set('autoIndex', autoIndex);
invitationSchema.index({
  token: 1,
  tokenExpires: 1,
});

module.exports = mongoose.model('Invitation', invitationSchema);