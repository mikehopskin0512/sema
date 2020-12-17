import { Pool } from 'pg';
import { createAppAuth } from '@octokit/auth';
import Analysis from './analysisModel';
import { github, pgPublicKey } from '../config';

import logger from '../shared/logger';
import errors from '../shared/errors';
import publish from '../shared/sns';

const pool = new Pool({ connectionString: process.env.POSTGRES_CONNECTION });
const snsTopic = process.env.AMAZON_SNS_CROSS_REGION_TOPIC;

export const create = async (repositoryId, runId) => {
  try {
    const newAnalysis = new Analysis({
      repositoryId,
      runId,
    });
    const savedAnalysis = await newAnalysis.save();
    return savedAnalysis;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

// GitHub token fetch
export const fetchGithubToken = async (externalSourceId) => {
  try {
    const auth = createAppAuth({
      clientId: github.clientId,
      clientSecret: github.clientSecret,
      id: github.appId,
      installationId: externalSourceId,
      privateKey: github.privateKey,
    });

    const { token } = await auth({ type: 'installation' });
    if (!token) {
      throw new errors.NotFound(
        `No token found for installationId ${externalSourceId}`,
      );
    }

    return token;
  } catch (err) {
    // Do not return error, instead throw
    throw new errors.BadRequest(
      `Error fetching token for installationId ${externalSourceId}`,
    );
  }
};

// Postgress functions for SCQP
export const findByProject = async (legacyId) => {
  try {
    const query = 'select * from autoingest_runs where project_id = $1 and (status = 0 or status = 2)'; // pending or running
    const runs = await pool.query(query, [legacyId]);

    return runs.rows;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const updateProjectWithCreds = async (legacyId, token) => {
  try {
    const query = `update projects set 
      repo_username = pgp_pub_encrypt('x-access-token', (SELECT dearmor('${pgPublicKey}') As pubkey)),
      repo_password = pgp_pub_encrypt($2, (SELECT dearmor('${pgPublicKey}') As pubkey))
      where id = $1`;
    const runs = await pool.query(query, [legacyId, token]);

    return runs.rows;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const createRun = async (legacyId) => {
  const userId = 118;
  const analysisType = 'All';
  try {
    const query = `insert into autoingest_runs 
    (starttime, user_id, project_id, status, progress, analysis_type, is_scheduled_run) 
    VALUES (to_timestamp(${Date.now()} / 1000.0), $1, $2, 0, 0, $3, false) 
    returning *`;
    const runs = await pool.query(query, [userId, legacyId, analysisType]);

    return runs.rows[0];
  } catch (err) {
    logger.error(err);
    throw new errors.BadRequest('Unable to start analysis');
  }
};

export const sendNotification = async (legacyId, runId) => {
  if (!snsTopic) return false;

  const snsFilter = {
    action: {
      DataType: 'String',
      StringValue: 'createAnalysis',
    },
  };

  const payload = {
    projectId: legacyId,
    runId,
  };

  const result = await publish(snsTopic, payload, snsFilter);
  return result;
};
