import mongoose from 'mongoose';

const { Schema } = mongoose;

const roleSchema = new Schema({
  name: String,
  key: String,
  canCreateCollections: Boolean,
  canEditCollections: Boolean,
  canCreateSnippets: Boolean,
  canEditSnippets: Boolean,
  canEditUsers: Boolean,
  canViewAdmin: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
