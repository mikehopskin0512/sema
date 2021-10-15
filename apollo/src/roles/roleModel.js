import mongoose from 'mongoose';

const { Schema } = mongoose;

const roleSchema = new Schema({
  name: String,
  canViewAdmin: Boolean,
  canEditUsers: Boolean,
  canEditComments: Boolean,
  canEditGuides: Boolean,
  canManageLinks: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
