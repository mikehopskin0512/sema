import mongoose from 'mongoose';

const { Schema } = mongoose;

const smartCommentSchema = new Schema({
  comment: String,
  suggestedComments: [{ type: Schema.Types.ObjectId, ref: 'SuggestedComment' }],
  reactions: { type: Schema.Types.ObjectId, ref: 'Reaction' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
}, { timestamps: true });

module.exports = mongoose.model('SmartComment', smartCommentSchema);
