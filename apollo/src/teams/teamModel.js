import mongoose from 'mongoose';

const { Schema } = mongoose;

const teamSchema = new Schema({
  name: String,
  avatarUrl: String,
  description: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
