import mongoose from 'mongoose';

const { Schema } = mongoose;

// Client application which requests access on behalf of user
const sourceSchema = new Schema({
    sourceName: {
    type: String,
    required: true,
  },
  sourceUrl: {
    type: String,
    unique: true,
    required: true,
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

const Source = mongoose.model('Source', sourceSchema);

module.exports = Source;
