import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import compression from 'compression';

import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import './auth/passport';

import logger from './shared/logger';
import errors from './shared/errors';

import routes from '.';
import { port, allowedOrigin, chromeExtensionId } from './config';

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

// Attach routes
routes.attachRoutes(app, passport);

app.all('*', (req, res, next) => {
  const ans = new errors.Unauthorized('Unauthorized API route');
  res.status(ans.statusCode).send(ans);
});

app.use((error, req, res, next) => {
  // Sets HTTP status code
  res.status(error.status || error.statusCode || 500);

  // Sends response
  res.json({
    status: error.status || error.statusCode,
    message: error.message,
    stack: error.stack,
  });
});

app.server = app.listen(port, async () => {
  logger.info('Server listening on port %d', port);
});

export default app;
