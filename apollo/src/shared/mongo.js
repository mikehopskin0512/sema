import mongoose from "mongoose";
import fs from "fs";
import logger from "./logger";
import errors from "./errors";
import { mongooseUri } from "../config";

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
mongoose.set("useFindAndModify", false);
mongoose.connect(mongooseUri, options);

mongoose.connection.on("connected", () => {
  logger.info(`Mongoose connection open to ${mongooseUri}`);
});

mongoose.connection.on("error", (err) => {
  logger.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  logger.info("Mongoose connection disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    logger.info("Mongoose connection disconnected through app termination");
    process.exit(0);
  });
});

const mongoService = (() => {
  const _verify = (done) => {
    if (mongoose.connection.readyState === 0) {
      const err = new errors.InternalServer("Not connected to MongoDB");
      logger.error(err);
      done(err);
      return false;
    }
    return true;
  };

  return {
    verifyConnection: _verify,
  };
})();

module.exports = mongoService;
