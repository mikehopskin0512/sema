import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

import userModel from '../users/userModel';
import { validate } from '../credentials/credentialService';
import { validateAuthToken } from '../auth/authService';

import logger from '../shared/logger';
import errors from '../shared/errors';
import db from '../shared/mongo';
import { tokenLife } from '../../config';

/**
 * These strategies are used to authenticate registered OAuth clients.
 * The authentication data may be delivered using the basic authentication scheme (recommended - in the authorization header)
 * or the client strategy, which means that the authentication data is in the body of the request.
 */
passport.use(new BasicStrategy(
  async (clientId, clientSecret, done) => {
    // logger.info('BASIC');

    if (db.verifyConnection(done)) {
      try {
        const payload = await validate(clientId, clientSecret);

        if (!payload) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, payload);
      } catch (err) {
        logger.error(err);
        return done(err);
      }
    }

    return done(null, false, { message: 'No connection to server' });
  },
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token). If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
  async (token, done) => {
    logger.info('BEARER');

    try {
      const user = await validateAuthToken(token);
      return done(null, user, { scope: '*' });
    } catch (err) {
      logger.error(err);
      return done(err);
    }
  },
));
