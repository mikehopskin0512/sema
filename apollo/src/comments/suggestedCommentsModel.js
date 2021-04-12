import mongoose from 'mongoose';

const { Schema } = mongoose;
var sourceSchema=require('./commentSourceModel')

// Client application which requests access on behalf of user
const commentSchema = new Schema({
    comment: {
    type: String,
    required: true,
  },
    title: {
    type: String,
    unique: true,
    required: true,
  },
  source: {
    type: sourceSchema.Source,
    required: true,
    index: true,
  },
  sourceId: {
    type: Schema.Types.ObjectId,
    ref: 'Source',
    required: true,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', commentSchema);
commentSchema.index({ sourceId: 1 });
module.exports = Comment;
