import bunyan from 'bunyan';
import { loggerEnabled } from '../../config';

let logger = null;

logger = bunyan.createLogger({
  name: 'apollo',
  streams: [{
    stream: process.stdout,
    level: 'info',
  }, {
    level: 'info',
    type: 'rotating-file',
    path: `logs/apollo-info.${process.pid}.log`,
    period: '1d',
    count: 4,
  }, {
    level: 'error',
    type: 'rotating-file',
    path: `logs/apollo-error.${process.pid}.log`,
    period: '1d',
    count: 4,
  }],
});

if (loggerEnabled === false) {
  logger = bunyan.createLogger({
    name: 'apollo-test',
    streams: [],
  });
}

module.exports = logger;
