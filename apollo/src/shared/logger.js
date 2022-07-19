import bunyan from 'bunyan';
import { Transform } from 'stream';
import BunyanRollbarStream from 'bunyan-rollbar-stream';
import { loggerEnabled } from '../config';
import rollbar from './rollbar';

export default bunyan.createLogger({
  name: 'apollo',
  streams: [getOutputStream(), getRollbarStream()].filter(Boolean),
});

function getOutputStream() {
  if (loggerEnabled === false) return null;

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
    transform(json, encoding, callback) {
      const { level, msg, err } = JSON.parse(json);
      const message = err ? err.stack || err.message || err.toString() : msg;
      const line = `${LEVELS[level]}: ${message}\n`;
      callback(null, line);
    },
  });

  humanReadable.pipe(process.stdout);

  return {
    stream: humanReadable,
    level: 'info',
  };
}

function getRollbarStream() {
  return {
    name: 'rollbar',
    stream: new BunyanRollbarStream({
      rollbar,
    }),
    level: 'error',
  };
}
