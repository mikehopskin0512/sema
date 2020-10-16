import { Pool } from 'pg';
import Organization from './organizationModel';
import logger from '../shared/logger';
import errors from '../shared/errors';

const pool = new Pool({ connectionString: process.env.POSTGRES_CONNECTION }); // e.g. postgres://user:password@host:5432/database

export const create = async (org) => {
  const {
    orgName = '', slug = '',
  } = org;

  try {
    const newOrg = new Organization({
      orgName,
      slug,
    });
    const savedOrg = await newOrg.save();
    return savedOrg;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const findBySlug = async (slug) => {
  try {
    const query = Organization.findOne({ slug });
    const org = await query.lean().exec();

    return org;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

const selectRepositoriesByOrg = async (orgId) => {
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

const selectContributors = async (orgId) => {
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

const selectFileTypesByOrg = async (orgId) => {
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

export {
  selectRepositoriesByOrg,
  selectContributors,
  selectFileTypesByOrg,
};
