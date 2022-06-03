import mongoose from 'mongoose';

const { Schema } = mongoose;

const userRoleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
  },
}, { timestamps: true });

module.exports = mongoose.model('UserRole', userRoleSchema);
