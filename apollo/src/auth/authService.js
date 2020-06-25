import { sign, verify } from "jsonwebtoken";
import { jwtSecret, privateKeyFile, refreshSecret, refreshTokenName } from '../../config';

export const createAuthToken = async(user) => {
  return sign({ user }, jwtSecret, {
    expiresIn: "15m"
  });
}

export const createRefreshToken = async(user) => {
  return sign({ user }, refreshSecret, {
    expiresIn: "1d"
  });
}

export const validateRefreshToken = async(token) => {
  return await verify(token, refreshSecret);
}

export const validateAuthToken = async(token) => {
  return await verify(token, jwtSecret);
}

export const setRefreshToken = (response, token) => {
  response.cookie(refreshTokenName, token, {
    // httpOnly: true
    // domain: '.semasoftware.com'
    path: "/"
  });
};
