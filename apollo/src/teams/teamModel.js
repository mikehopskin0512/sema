import mongoose from 'mongoose';

const { Schema } = mongoose;

const teamSchema = new Schema({
  name: String,
  avatarUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
