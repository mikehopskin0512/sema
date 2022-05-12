import bunyan from 'bunyan';
import { Transform } from 'stream';
import { loggerEnabled } from '../config';

export default bunyan.createLogger({
  name: 'apollo',
  streams: [
    getOutputStream(),
    {
      level: 'info',
      type: 'rotating-file',
      path: `logs/apollo-info.${process.pid}.log`,
      period: '1d',
      count: 4,
    },
    {
      level: 'error',
      type: 'rotating-file',
      path: `logs/apollo-error.${process.pid}.log`,
      period: '1d',
      count: 4,
    },
  ].filter(Boolean),
});

function getOutputStream() {
  if (loggerEnabled === false) return null;

  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return {
      stream: process.stdout,
      level: 'info',
    };
  }

  return getOutputStreamForDevelopment();
}

function getOutputStreamForDevelopment() {
  const LEVELS = {
    [bunyan.TRACE]: 'trace',
    [bunyan.DEBUG]: 'debug',
    [bunyan.INFO]: 'info',
    [bunyan.WARN]: 'warn',
    [bunyan.ERROR]: 'error',
    [bunyan.FATAL]: 'fatal',
  };

  const humanReadable = new Transform({
    objectMode: true,
    transform(object, encoding, callback) {
      const { level, msg, err } = JSON.parse(object);
      const line = `${LEVELS[level]}: ${err ? err.stack : msg}\n`;
      callback(null, line);
    },
  });

  humanReadable.pipe(process.stdout);

  return {
    stream: humanReadable,
    level: 'info',
  };
}
