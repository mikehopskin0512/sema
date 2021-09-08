import mongoose from 'mongoose';

const { Schema } = mongoose;

const userRoleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
  },
}, { timestamps: true });

module.exports = mongoose.model('UserRole', userRoleSchema);
