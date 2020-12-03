import mongoose from 'mongoose';
import { createAppAuth } from '@octokit/auth';
import { getAppRepos } from '../identity/github/utils';
import { github } from '../config';
import Source from './sourceModel';
import logger from '../shared/logger';
import errors from '../shared/errors';

const {
  Types: { ObjectId },
} = mongoose;

export const create = async (source) => {
  try {
    const { orgId, type } = source;

    const query = Source.findOneAndUpdate(
      { orgId, type },
      { $set: source },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    const updatedSource = await query.exec();

    return updatedSource;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const find = async (id) => {
  try {
    const query = Source.findOne({ _id: new ObjectId(id) });
    const source = await query.lean().exec();

    return source;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByOrg = async (orgId) => {
  try {
    const query = Source.find({ orgId });
    const sources = await query.lean().exec();

    return sources;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const fetchRepositoriesGithub = async (externalSourceId) => {
  try {
    const auth = createAppAuth({
      clientId: github.clientId,
      clientSecret: github.clientSecret,
      id: github.appId,
      installationId: externalSourceId,
      privateKey: github.privateKey,
    });

    const { token } = await auth({ type: 'installation' });

    // Note: response from Github contains count, selection and repos array
    const { repositories } = await getAppRepos(token);

    if (!repositories) {
      throw new errors.NotFound(
        `No repositories found for installationId ${externalSourceId}`,
      );
    }

    return repositories;
  } catch (err) {
    // Do not return error, instead throw
    throw new errors.BadRequest(
      `Error fetching repositories for installationId ${externalSourceId}`,
    );
  }
};
