import bunyan from 'bunyan';
import { Transform } from 'stream';
import { loggerEnabled } from '../config';

export default bunyan.createLogger({
  name: 'apollo',
  streams: [getOutputStream()].filter(Boolean),
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
