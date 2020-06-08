import uuid from 'uuid';
import crypto from 'crypto';

import AccessTokenModel from './accessTokenModel';
import RefreshTokenModel from './refreshTokenModel';

import logger from '../shared/logger';
import { tokenLife } from '../../config';
import { handle } from '../shared/utils';

const tokenService = (() => {
  const _generateTokens = async (modelData) => {
    const accessToken = uuid.v4();
    const refreshToken = uuid.v4();
    const refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');
    let newAccessToken;
    let newRefreshToken;

    const [refreshDelete, refreshDeleteErr] = await handle(RefreshTokenModel.deleteMany(modelData));
    if (refreshDeleteErr) {
      logger.error(`Error at refreshToken.remove: ${refreshDeleteErr}`);
      throw new Error('Error at refreshToken.remove');
    }

    const [accessDelete, accessDeleteErr] = await handle(AccessTokenModel.deleteMany(modelData));
    if (accessDeleteErr) {
      logger.error(`Error at accessToken.remove: ${accessDeleteErr}`);
      throw new Error('Error at accessToken.remove');
    }

    modelData.accessToken = accessToken;
    newAccessToken = new AccessTokenModel(modelData);

    modelData.refreshToken = refreshTokenHash;
    newRefreshToken = new RefreshTokenModel(modelData);


    const [refreshSave, refreshSaveErr] = await handle(newRefreshToken.save());
    if (refreshSaveErr) {
      logger.error(`Error at refreshToken.save: ${refreshSaveErr}`);
      throw new Error('Error at refreshToken.save');
    }

    const [accessSave, accessSaveErr] = await handle(newAccessToken.save());
    if (accessSaveErr) {
      logger.error(`Error at accessToken.save: ${accessSaveErr}`);
      throw new Error('Error at accessToken.save');
    }

    return {
      accessToken,
      refreshToken,
      expires_in: tokenLife,
      userId: modelData.userId,
    };
  };

  return {
    generateTokens: _generateTokens,
  };
})();

module.exports = tokenService;
