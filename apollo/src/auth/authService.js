import { addMinutes } from '../shared/utils';
import { sign, verify } from 'jsonwebtoken';
import {
  jwtSecret, privateKeyFile,
  refreshSecret, refreshTokenName, rootDomain,
  userVoiceKey,
} from '../config';
import { updateLastLogin } from '../users/userService';

import RefreshToken from './refreshTokenModel';

const nodeEnv = process.env.NODE_ENV || 'development';

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
      exp: addMinutes(15),
    }, userVoiceKey,
  );
};

export const createAuthToken = async (user) => sign({ user, userVoiceToken: await createUserVoiceIdentityToken(user) }, jwtSecret, {
  expiresIn: '15m',
});

export const createIdentityToken = async (identity) => sign({ identity }, jwtSecret, {
  expiresIn: '15m',
});

export const createRefreshToken = async (user) => sign({ user }, refreshSecret, {
  expiresIn: '30d',
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

  // Won't record lastLogin if user is in the waitlist.
  if (!user.isWaitlist) {
    await updateLastLogin(user);
  }

  response.cookie(refreshTokenName, token, cookieConfig);
};
