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

// if (mongooseCertPath) {
//   const ca = [fs.readFileSync(process.cwd() + mongooseCertPath)];
//   options.mongos.sslCA = ca;
//   options.mongos.ca = ca;
// }

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
  // eslint-disable-next-line no-param-reassign
  schema.statics.findOrCreate = async function findOrCreate(attrs) {
    try {
      return await this.create(attrs);
    } catch (error) {
      const isDuplicate = error.code === 11000 && error.keyPattern;
      if (isDuplicate) {
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
