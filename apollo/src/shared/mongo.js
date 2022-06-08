import mongoose from 'mongoose';
import logger from './logger';
import errors from './errors';
import { mongooseUri } from '../config';

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
};

mongoose.Promise = global.Promise;

// Connect to DB
mongoose.set('useFindAndModify', false);
mongoose.connect(mongooseUri, options);

mongoose.connection.on('connected', () => {
  logger.info(`Mongoose connection open to ${mongooseUri}`);
});

mongoose.connection.on('error', (err) => {
  logger.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});

mongoose.plugin((schema) => {
  // Find or create a record. Assumes a unique index on the key.
  //
  // Usage:
  //
  //   Repository.findOrCreate({ 'github.id': id }, { name: 'Phoenix' })
  //
  // eslint-disable-next-line no-param-reassign
  schema.statics.findOrCreate = async function findOrCreate(key, attrs) {
    try {
      return await this.create({ ...attrs, ...key });
    } catch (error) {
      const isDuplicateOnThisKey =
        error.code === 11000 &&
        Object.keys(error.keyPattern).sort().join(',') ===
          Object.keys(key).sort().join(',');
      if (isDuplicateOnThisKey) {
        const doc = await this.findOne(error.keyValue);
        doc.set(attrs);
        return await doc.save();
      }
      throw error;
    }
  };
});

const mongoService = {
  verifyConnection(done) {
    if (mongoose.connection.readyState === 0) {
      const err = new errors.InternalServer('Not connected to MongoDB');
      logger.error(err);
      done(err);
      return false;
    }
    return true;
  },
};

export default mongoService;
