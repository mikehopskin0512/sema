import mongoose from 'mongoose';
import Organization from './organizationModel';
import errors from '../shared/errors';
import logger from '../shared/logger';
import { metricsStartDate } from '../shared/utils';
import UserRole from '../userRoles/userRoleModel';
import { getRepositories } from '../repositories/repositoryService';
import {
  getOrganizationSmartCommentsMetrics,
  getSmartCommentsByExternalId,
  getPullRequests,
  getSmartCommentersCount,
} from '../comments/smartComments/smartCommentService';
import { createUserRole } from '../userRoles/userRoleService';
import { getRoleByName } from '../roles/roleService';
import { semaCorporateOrganizationName } from '../config';
import { findByUsername, getOrganizationUsersMetrics } from '../users/userService';
import { uploadImage } from '../utils';

const {
  Types: { ObjectId },
} = mongoose;

export const ROLE_NAMES = {
  ADMIN: 'Admin',
  LIBRARY_EDITOR: 'Library Editor',
  MEMBER: 'Member',
};

export const createMembersRoles = async (members, organizationId) => {
  const memberRole = await getRoleByName(ROLE_NAMES.MEMBER);
  // TODO: need a refactoring to Array
  const membersArray = Array.isArray(members) ? members : members.split(',');
  await Promise.all(
    membersArray.map(async (member) => {
      const user = await findByUsername(member.trim());
      await createUserRole({
        user: user._id,
        organization: organizationId,
        role: memberRole._id,
      });
    })
  );
};
// TODO: tto
export const getOrganization = async (userId) => {
  const organizations = await Organization.find({ createdBy: userId });
  return organizations;
};

export const getOrganizationsByUser = async (userId) => {
  try {
    const roles = await UserRole.find({ user: userId })
      .populate({
        path: 'organization',
        populate: { path: 'collections.collectionData' },
      })
      .populate('role')
      .exec();
    // TODO Investigate why we sometimes get organization as null in DB in UserRoles
    return roles.filter(({ organization }) => organization);
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getOrganizationByUrl = async (url) => {
  try {
    const organization = await Organization.findOne({ url }).exec();
    return organization || null;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getOrganizationById = async (id) => {
  try {
    const query = Organization.findOne({ _id: new ObjectId(id) });
    const organization = await query
      .lean()
      .populate({
        path: 'collections.collectionData',
        model: 'Collection',
        select: {
          _id: 1,
          isActive: 1,
          name: 1,
          description: 1,
          author: 1,
          tags: 1,
          source: 1,
          comments: 1,
          type: 1,
        },
      })
      .exec();
    return organization || {};
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const createOrganization = async (data) => {
  try {
    if (data.name === semaCorporateOrganizationName) {
      throw new Error(`The ${semaCorporateOrganizationName} name is reserved`);
    }
    const { members } = data;
    const organization = new Organization(data);
    await organization.save();

    const adminRole = await getRoleByName(ROLE_NAMES.ADMIN);
    await createUserRole({
      user: data.createdBy,
      organization: organization._id,
      role: adminRole._id,
    });

    if (members) {
      await createMembersRoles(members, organization._id);
    }

    return organization;
  } catch (err) {
    console.log("ERRRRRRRRRTR!", err);
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const updateOrganization = async (data) => {
  try {
    const { _id, members } = data;
    if (!_id) {
      const error = new Error('No Organization ID');
      error.status = 401;
      throw error;
    }
    if (members) {
      createMembersRoles(members, _id);
    }
    const query = await Organization.findOneAndUpdate({ _id }, data, {
      new: true,
      upsert: false,
      setDefaultsOnInsert: true,
    });
    return query;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const updateOrganizationRepos = async (organizationId, repoIds) => {
  try {
    const organization = await Organization.findOneAndUpdate(
      { _id: organizationId },
      { $set: { repos: repoIds.map((id) => new ObjectId(id)) } }
    ).exec();
    return organization;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getOrganizationRepos = async (organizationId, params = {}) => {
  try {
    const { searchQuery = '' } = params;
    const [organization] = await Organization.find({ _id: organizationId }).select('repos').exec();
    const ids = organization?.repos.map((repo) => repo._id.toString()) || [];
    return getRepositories({ ids, searchQuery }, true);
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export async function getOrganizationMetrics(organizationId) {
  const userMetrics = await getOrganizationUsersMetrics(organizationId);
  const commentsMetrics = await getOrganizationSmartCommentsMetrics(organizationId);
  let metrics = [];
  const auxDate = new Date(metricsStartDate);
  const today = new Date();
  while (auxDate <= today) {
    const dateAsString = auxDate.toISOString().split('T')[0];
    const values = commentsMetrics?.[dateAsString] ?? {
      comments: 0,
      pullRequests: 0,
      commenters: 0,
    };
    values.users = userMetrics?.[dateAsString] ?? 0;
    metrics = [...metrics, values];
    auxDate.setDate(auxDate.getDate() + 1);
  }
  return metrics;
}

export async function getOrganizationTotalMetrics(organizationId) {
  const totalMetrics = {
    smartCodeReviews: 0,
    smartComments: 0,
    smartCommenters: 0,
    semaUsers: 0,
  };
  const organizationRepos = await getOrganizationRepos(organizationId);
  const repoExternalIds = organizationRepos.map((repo) => repo.externalId);
  let smartComments = await Promise.all(
    repoExternalIds.map(async (id) => await getSmartCommentsByExternalId(id))
  );
  smartComments = smartComments.flat();
  totalMetrics.smartComments = smartComments.length || 0;
  totalMetrics.smartCodeReviews = getSmartCommentersCount(smartComments);
  totalMetrics.smartCommenters = getPullRequests(smartComments);
  totalMetrics.semaUsers = totalMetrics.smartCommenters;
  return totalMetrics;
}

export const getOrganizationMembers = async (
  organizationId,
  { page, perPage },
  type = 'paginate'
) => {
  try {
    const options = {};
    if (type === 'paginate') {
      options.skip = perPage * (page - 1);
      options.limit = perPage;
    }
    const members = await UserRole.find({ organization: organizationId }, {}, options)
      .populate('user')
      .populate('role');

    const totalCount = await UserRole.countDocuments({ organization: organizationId });

    return { members, totalCount };
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const addOrganizationMembers = async (organization, users, role) => {
  try {
    let allUsers = await Promise.all(
      users.map(async (user) => await findByUsername(user))
    );
    allUsers = allUsers.map((user) => user?._id);
    return await Promise.all(
      allUsers.map(async (user) => {
        if (!user) return;
        const isExist = await UserRole.exists({ organization, user });
        if (isExist) {
          await UserRole.updateOne({ organization, user }, { role });
        } else {
          await UserRole.create({ organization, user, role });
        }
      })
    );
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const updateOrganizationAvatar = async (organizationId, userId, file) => {
  const organization = await Organization.findById(organizationId);

  const uploadedImage = await uploadImage(file);

  organization.avatarUrl = uploadedImage.Location;
  await organization.save();

  const role = await UserRole.findOne({
    organization: organizationId,
    user: userId,
  })
    .populate('organization')
    .populate('role');

  return role;
};
