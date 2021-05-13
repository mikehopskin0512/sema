import { sign, verify } from 'jsonwebtoken';
import {
  jwtSecret, privateKeyFile,
  refreshSecret, refreshTokenName, rootDomain,
  userVoiceKey,
} from '../config';

import RefreshToken from './refreshTokenModel';

const nodeEnv = process.env.NODE_ENV || 'development';

const createUserVoiceIdentityToken = async ({ _id, username, firstName, lastName }) => (
  sign({ guid: _id, email: username, display_name: `${firstName} ${lastName}` }, userVoiceKey)
);

export const createAuthToken = async (user) => sign({ user, userVoiceToken: await createUserVoiceIdentityToken(user) }, jwtSecret, {
  expiresIn: '15m',
});

export const createIdentityToken = async (identity) => sign({ identity }, jwtSecret, {
  expiresIn: '15m',
});

export const createRefreshToken = async (user) => sign({ user }, refreshSecret, {
  expiresIn: '1d',
});

export const validateRefreshToken = async (token) => {
  const payload = await verify(token, refreshSecret);
  return payload;
};

export const validateAuthToken = async (token) => {
  const payload = await verify(token, jwtSecret);
  return payload;
};

export const setRefreshToken = async (response, user, token) => {
  const cookieConfig = {
    // httpOnly: true
    path: '/',
  };

  const { _id: userId } = user;
  const filter = { userId };
  const update = { token };
  const options = { new: true, upsert: true };

  // Can't use domain on localhost or cookie fails to be set
  if (nodeEnv !== 'development') {
    cookieConfig.domain = `.${rootDomain}`;
  } else {
    console.log(`${nodeEnv} === development, so we are NOT setting cookieConfig.domain`);
  }

  await RefreshToken.findOneAndUpdate(filter, update, options);

  response.cookie(refreshTokenName, token, cookieConfig);
};
