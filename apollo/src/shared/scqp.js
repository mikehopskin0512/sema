import { Pool } from 'pg';
import { pgPublicKey } from '../config';

import logger from './logger';
import errors from './errors';

const pool = new Pool({ connectionString: process.env.POSTGRES_CONNECTION });

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

// Data for filters
export const selectRepositoriesByOrg = async (orgId) => {
  try {
    const query = 'select id, name from projects where organization_id = $1 order by name asc;';
    const repos = await pool.query(query, [orgId]);

    return repos.rows;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const selectContributors = async (orgId) => {
  try {
    const query = 'select id, name from committers where organization_id = $1 order by name asc;';
    const repos = await pool.query(query, [orgId]);

    return repos.rows;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const selectFileTypesByOrg = async (orgId) => {
  try {
    const query = `select distinct ft.id, ft.typename 
      from commit_analysis ca 
      left join filetypes ft
        on ca.file_type_id = ft.id
      left join projects p
        on ca.project_id = p.id
      where p.organization_id = $1
      order by ft.typename`;
    const fileTypes = await pool.query(query, [orgId]);

    return fileTypes.rows;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};
