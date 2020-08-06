import { sign, verify } from 'jsonwebtoken';
import { jwtSecret, privateKeyFile, refreshSecret, refreshTokenName } from '../../config';

export const createAuthToken = async (user) => sign({ user }, jwtSecret, {
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
  response.cookie(refreshTokenName, token, {
    // httpOnly: true
    // domain: '.semasoftware.com'
    path: '/',
  });
};
