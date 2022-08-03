import mongoose from 'mongoose';

const { Schema } = mongoose;

const userRoleSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

userRoleSchema.index({ user: 1, organization: 1 }, { unique: true });

export default mongoose.model('UserRole', userRoleSchema);
