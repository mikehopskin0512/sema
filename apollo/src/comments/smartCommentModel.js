import mongoose from 'mongoose';

const { Schema } = mongoose;

const smartCommentSchema = new Schema({
  comment: String,
  reactions: [{ type: Schema.Types.ObjectId, ref: 'Reaction' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
}, { timestamps: true });

module.exports = mongoose.model('SmartComment', smartCommentSchema);
