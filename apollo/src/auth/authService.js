import { sign, verify } from 'jsonwebtoken';
import {
  jwtSecret, privateKeyFile,
  refreshSecret, refreshTokenName, rootDomain,
} from '../config';

const nodeEnv = process.env.NODE_ENV || 'development';

export const createAuthToken = async (user) => sign({ user }, jwtSecret, {
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

export const setRefreshToken = (response, token) => {
  const cookieConfig = {
    // httpOnly: true
    path: '/',
  };

  // Can't use domain on localhost or cookie fails to be set
  if (nodeEnv !== 'development') {
    cookieConfig.domain = `.${rootDomain}`;
  } else {
    console.log("rootDomain is set to localhost, so we are NOT setting cookieConfig.domain");
  }

  response.cookie(refreshTokenName, token, cookieConfig);
};
