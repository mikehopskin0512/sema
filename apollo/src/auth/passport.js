import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

import userModel from '../users/userModel';
import credentialService from '../credentials/credentialService';
import accessTokenModel from './accessTokenModel';

import logger from '../shared/logger';
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
        const payload = await credentialService.validate(clientId, clientSecret);

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
  async (accessToken, done) => {
    // logger.info('BEARER');

    try {
      const token = await accessTokenModel.findOne({ accessToken });

      if (!token) {
        return done(null, false, { message: 'Invalid access token' });
      }

      // Check for expired token
      if (Math.round((Date.now() - token.created) / 1000) > tokenLife) {
        await accessTokenModel.remove(accessToken);
        return done(null, false, { message: 'Token expired' });
      }

      // Find user
      const user = await userModel.findById(token.userId);
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }

      return done(null, user, { scope: '*' });
    } catch (err) {
      logger.error(err);
      return done(err);
    }
  },
));
