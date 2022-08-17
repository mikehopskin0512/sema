import './shared/mongo';
import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import compression from 'compression';
import expressBunyanLogger from 'express-bunyan-logger';

import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import './auth/passport';

import logger from './shared/logger';
import errors from './shared/errors';
import rollbar from './shared/rollbar';
import health from './shared/health';

import attachRoutes from './index';
import './queues';
import { port, allowedOrigin, chromeExtensionId } from './config';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(
  cors({
    origin: [
      allowedOrigin,
      'https://github.com',
      /\.github\.com$/,
      `chrome-extension://${chromeExtensionId}`,
    ],
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '2mb',
  })
);
app.use(bodyParser.json({ limit: '2mb' }));
app.use(methodOverride());
app.use(passport.initialize());
app.disable('x-powered-by');

app.use('/static', express.static('./uploads'));

// Prevent health check request from flooding logs.
health(app);
app.use(
  expressBunyanLogger({
    logger,
    parseUA: false,
    format:
      ':remote-address :method :url HTTP/:http-version :status-code :res-headers[content-length] :referer ":user-agent" :response-time ms',
  })
);

// Attach routes
attachRoutes(app, passport);

app.all('*', (req, res, next) => {
  const ans = new errors.Unauthorized('Unauthorized API route');
  res.status(ans.statusCode).send(ans);
});

// Error handling
app.use((error, req, res, next) => {
  const isNotFound =
    error.name === 'AssertionError' && error.message === 'Not found';
  if (isNotFound) {
    res.sendStatus(404);
  } else next(error);
});

app.use(rollbar.errorHandler());

app.use((error, req, res, next) => {
  logger.error(error);

  const status = error.status || error.statusCode || 500;

  res.status(status).json({
    status,
    message: error.message,
    // Don't leak error stack trace in production.
    stack: isProduction ? undefined : error.stack,
  });
});

app.server = app.listen(port, async () => {
  logger.info('Server listening on port %d', port);
});

export default app;
