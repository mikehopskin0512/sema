import mongoose from 'mongoose';
import Team from './teamModel';
import errors from '../shared/errors';
import logger from '../shared/logger';
import { metricsStartDate } from '../shared/utils';
import UserRole from '../userRoles/userRoleModel';
import { getRepositories } from '../repositories/repositoryService';
import {
  getTeamSmartCommentsMetrics,
  getSmartCommentsByExternalId,
  getPullRequests,
  getSmartCommentersCount,
} from '../comments/smartComments/smartCommentService';
import { createUserRole } from '../userRoles/userRoleService';
import { getRoleByName } from '../roles/roleService';
import { semaCorporateTeamName } from '../config';
import { findByUsername, getTeamUsersMetrics } from '../users/userService';
import { uploadImage } from '../utils';

const {
  Types: { ObjectId },
} = mongoose;

export const ROLE_NAMES = {
  ADMIN: 'Admin',
  LIBRARY_EDITOR: 'Library Editor',
  MEMBER: 'Member',
};

export const createMembersRoles = async (members, teamId) => {
  const memberRole = await getRoleByName(ROLE_NAMES.MEMBER);
  // TODO: need a refactoring to Array
  const membersArray = Array.isArray(members) ? members : members.split(',');
  await Promise.all(
    membersArray.map(async (member) => {
      const user = await findByUsername(member.trim());
      await createUserRole({
        user: user._id,
        team: teamId,
        role: memberRole._id,
      });
    })
  );
};

export const getTeams = async (userId) => {
  const teams = await Team.find({ createdBy: userId });
  return teams;
};

export const getTeamsByUser = async (userId) => {
  try {
    const teams = await UserRole.find({ user: userId })
      .populate({
        path: 'team',
        populate: { path: 'collections.collectionData' },
      })
      .populate('role')
      .exec();
    // TODO Investigate why we sometimes get team as null in DB in UserRoles
    return teams.filter((team) => team.team);
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getTeamByUrl = async (url) => {
  try {
    const team = await Team.findOne({ url }).exec();
    return team || null;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getTeamById = async (id) => {
  try {
    const query = Team.findOne({ _id: new ObjectId(id) });
    const team = await query
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

    return team || {};
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const createTeam = async (data) => {
  try {
    if (data.name === semaCorporateTeamName) {
      throw new Error(`The ${semaCorporateTeamName} name is reserved`);
    }
    const { members } = data;
    const team = new Team(data);
    await team.save();

    const adminRole = await getRoleByName(ROLE_NAMES.ADMIN);
    const userRoleBody = {
      user: data.createdBy,
      team: team._id,
      role: adminRole._id,
    };
    await createUserRole(userRoleBody);

    if (members) {
      createMembersRoles(members, team._id);
    }

    return team;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const updateTeam = async (data) => {
  try {
    const { _id, members } = data;
    if (!_id) {
      const error = new Error('No Team ID');
      error.status = 401;
      throw error;
    }
    if (members) {
      createMembersRoles(members, _id);
    }
    const query = await Team.findOneAndUpdate({ _id }, data, {
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

export const updateTeamRepos = async (teamId, repoIds) => {
  try {
    const team = await Team.findOneAndUpdate(
      { _id: teamId },
      { $set: { repos: repoIds.map((id) => new ObjectId(id)) } }
    ).exec();
    return team;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getTeamRepos = async (teamId, params = {}) => {
  try {
    const { searchQuery = '' } = params;
    const [team] = await Team.find({ _id: teamId }).select('repos').exec();
    const ids = team?.repos.map((repo) => repo._id.toString()) || [];
    return getRepositories({ ids, searchQuery }, true);
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export async function getTeamMetrics(teamId) {
  const userMetrics = await getTeamUsersMetrics(teamId);
  const commentsMetrics = await getTeamSmartCommentsMetrics(teamId);
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

export async function getTeamTotalMetrics(teamId) {
  const totalMetrics = {
    smartCodeReviews: 0,
    smartComments: 0,
    smartCommenters: 0,
    semaUsers: 0,
  };
  const teamRepos = await getTeamRepos(teamId);
  const repoExternalIds = teamRepos.map((repo) => repo.externalId);
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

export const getTeamMembers = async (
  teamId,
  { page, perPage },
  type = 'paginate'
) => {
  try {
    const options = {};
    if (type === 'paginate') {
      options.skip = perPage * (page - 1);
      options.limit = perPage;
    }
    const members = await UserRole.find({ team: teamId }, {}, options)
      .populate('user')
      .populate('role');

    const totalCount = await UserRole.countDocuments({ team: teamId });

    return { members, totalCount };
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const addTeamMembers = async (team, users, role) => {
  try {
    let allUsers = await Promise.all(
      users.map(async (user) => await findByUsername(user))
    );
    allUsers = allUsers.map((user) => user?._id);
    return await Promise.all(
      allUsers.map(async (user) => {
        if (!user) return;
        const isExist = await UserRole.exists({ team, user });
        if (isExist) {
          await UserRole.updateOne({ team, user }, { role });
        } else {
          await UserRole.create({ team, user, role });
        }
      })
    );
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const updateTeamAvatar = async (teamId, userId, file) => {
  const team = await Team.findById(teamId);

  const uploadedImage = await uploadImage(file);

  team.avatarUrl = uploadedImage.Location;
  await team.save();

  const role = await UserRole.findOne({
    team: teamId,
    user: userId,
  })
    .populate('team')
    .populate('role');

  return role;
};
