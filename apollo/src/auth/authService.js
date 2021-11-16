import { sign, verify } from 'jsonwebtoken';
import {
  jwtSecret, privateKeyFile, tokenLife,
  refreshSecret, refreshTokenName, rootDomain,
  userVoiceKey,
} from '../config';
import { updateLastLogin } from '../users/userService';

import RefreshToken from './refreshTokenModel';
const nodeEnv = process.env.NODE_ENV || 'development';
const authTokenMinutes = 15;

const createUserVoiceIdentityToken = async ({ _id, username, firstName = '', lastName = '' }) => {
  let displayName = 'Sema User';

  if (firstName !== '' || lastName !== '') {
    displayName = `${firstName} ${lastName}`.trim();
  }

  return sign(
    {
      guid: _id,
      email: username,
      display_name: displayName,
      trusted: true,
      exp: Math.floor(Date.now() / 1000) + (authTokenMinutes * 60),
    }, userVoiceKey,
  );
};

export const createAuthToken = async (user) => sign({ user, userVoiceToken: await createUserVoiceIdentityToken(user), exp: Math.floor(Date.now() / 1000) + (authTokenMinutes * 60) }, jwtSecret);

export const createIdentityToken = async (identity) => sign({ identity, exp: Math.floor(Date.now() / 1000) + (authTokenMinutes * 60) }, jwtSecret);

export const createRefreshToken = async (user) => sign({ user, exp: Math.floor(Date.now() / 1000) + parseInt(tokenLife, 10) }, refreshSecret);

export const validateRefreshToken = async (token) => {
  const payload = await verify(token, refreshSecret);
  return payload;
};

export const validateAuthToken = async (token) => {
  const payload = await verify(token, jwtSecret);
  return payload;
};

export const setRefreshToken = async (response, user, token) => {
  // Set cookie expDate based on tokenLife
  const expDate = new Date();
  expDate.setTime(expDate.getTime() + (tokenLife * 1000));

  // Define cookie config options
  const cookieConfig = {
    path: '/',
    expires: expDate
  };
  const { _id: userId } = user;
  const filter = { userId };
  const update = { token };
  const options = { new: true, upsert: true };

  // Can't use domain on localhost or cookie fails to be set
  if (nodeEnv !== 'development') {
    cookieConfig.domain = `.${rootDomain}`;
    cookieConfig.secure = true;

    // Removed httpOnly setting from cookie. Causes issues with JWT token refresh.
    // cookieConfig.httpOnly = true;
  } else {
    console.log(`${nodeEnv} === development, so we are NOT setting cookieConfig.domain`);
  }

  await RefreshToken.findOneAndUpdate(filter, update, options);

  // Won't record lastLogin if user is in the waitlist.
  if (!user.isWaitlist) {
    await updateLastLogin(user);
  }

  response.cookie(refreshTokenName, token, cookieConfig);
};
