import crypto from 'crypto';
import uuid from 'uuid';
import ClientModel from './credentialModel';
import logger from '../shared/logger';
import errors from '../shared/errors';

const credentialService = (() => {
  const _create = async (userId, applicationName) => {
    try {
      const secret = uuid.v4();
      const client = new ClientModel();
      client.name = applicationName;
      client.clientId = uuid.v4();
      client.clientSecret = crypto.createHash('sha1').update(secret).digest('hex');
      client.userId = userId;
      const payload = await client.save();

      return payload;
    } catch (err) {
      logger.error(err);
      return err;
    }
  };

  const _get = async (userId) => {
    try {
      const payload = await ClientModel.find({ userId }).lean().exec();
      return payload;
    } catch (err) {
      logger.error(err);
      return err;
    }
  };

  const _validate = async (clientId, clientSecret) => {
    const clientSecretHash = crypto.createHash('sha1').update(clientSecret).digest('hex');
    let client;
    try {
      client = await ClientModel.findOne({ clientId }, 'clientId clientSecret');
      if (!client) {
        throw new errors.Unauthorized('Unauthorized client');
      }
    } catch (err) {
      logger.error(err);
      return err;
    }

    // Validate password
    if (client.clientSecret !== clientSecretHash) {
      throw new errors.Unauthorized('Invalid password');
    }

    return client;
  };

  return {
    create: _create,
    get: _get,
    validate: _validate,
  };
})();

module.exports = credentialService;
