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
import { buildSuggestedCommentsIndex } from './comments/commentService';

import routes from '.';
import { port, allowedOrigin } from './config';

const app = express();

app.use(cors({
  origin: [allowedOrigin, 'https://github.com', /\.github\.com$/],
  credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(passport.initialize());
app.disable('x-powered-by');

// Attach routes
routes.attachRoutes(app, passport);

app.all('*', (req, res, next) => {
  const ans = new errors.Unauthorized('Unauthorized API route');
  res.status(ans.statusCode).send(ans);
});

app.use((error, req, res, next) => {
  // Sets HTTP status code
  res.status(error.status || 500);

  // Sends response
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
});

// search indexing for suggested comments on service booting
buildSuggestedCommentsIndex();

app.listen(port, () => {
  logger.info('Server listening on port %d', port);
});

module.exports = app;
