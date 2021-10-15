import mongoose from 'mongoose';

const { Schema } = mongoose;

const teamSchema = new Schema({
  name: String,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
