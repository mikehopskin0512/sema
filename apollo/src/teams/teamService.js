import mongoose from 'mongoose';
import Team from './teamModel';
import errors from '../shared/errors';
import logger from '../shared/logger';
import UserRole from '../userRoles/userRoleModel';
import { getRepositories } from '../repositories/repositoryService';
import { getSmartCommentsByExternalId, _getPullRequests, _getSmartCommentersCount } from '../comments/smartComments/smartCommentService';
import { uniq } from 'lodash';
import { createUserRole } from '../userRoles/userRoleService';
import { getRoleByName } from '../roles/roleService';
import { semaCorporateTeamName } from '../config';
import { findByUsername } from '../users/userService';
const { Types: { ObjectId } } = mongoose;

export const ROLE_NAMES = {
  ADMIN: 'Admin',
  LIBRARY_EDITOR: 'Library Editor',
  MEMBER: 'Member',
};

export const createMembersRoles = async (members, teamId) => {
  const memberRole = await getRoleByName(ROLE_NAMES.MEMBER);
  members.split(',').forEach(async (member) => {
    const user = await findByUsername(member.trim());
    await createUserRole({
      user: user._id,
      team: teamId,
      role: memberRole._id,
    });
  });
}

export const getTeams = async (userId) => {
  const teams = await Team.find({ createdBy: userId });
  return teams;
};

export const getTeamsByUser = async (userId) => {
  try {
    const teams = await UserRole.find({ user: userId })
      .populate('team')
      .populate('role');
    return teams;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const createTeam = async (data) => {
  try {
    if (data.name === semaCorporateTeamName) {
      throw `The ${semaCorporateTeamName} name is reserved`;
    }
    const { members } = data;
    const team = new Team(data);
    await team.save();

    const adminRole = await getRoleByName(ROLE_NAMES.ADMIN);
    const userRoleBody = {
      user: data.createdBy,
      team: team._id,
      role: adminRole._id,
    }
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
      throw({ status: 401, msg: 'No Team ID' })
    }
    if (members) {
      createMembersRoles(members, _id);
    }
    const query = await Team.findOneAndUpdate({ _id }, data, { new: true, upsert: false, setDefaultsOnInsert: true });
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


export const getTeamRepos = async (teamId) => {
  try {
    const [team] = await Team
      .find({ _id: teamId })
      .select('repos')
      .exec();
    const ids = team?.repos.map(repo => repo._id.toString()) || [];
    return getRepositories(ids);
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getTeamMetrics = async (teamId) => {
  try {
    const totalMetrics = {
      smartCodeReviews: 0,
      smartComments: 0,
      smartCommenters: 0,
      semaUsers: 0,
    }
    const teamRepos = await getTeamRepos(teamId);
    const repoExternalIds = teamRepos.map((repo) => {
      return repo.externalId;
    });
    const semaUsers = uniq(teamRepos.map((repo) => repo.repoStats.userIds.map((id) => id?.toString())).flat());
    totalMetrics.semaUsers = semaUsers.length;
    let smartComments = await Promise.all(repoExternalIds.map(async (id) => {
      return await getSmartCommentsByExternalId(id)
    }));
    smartComments = smartComments.flat();
    totalMetrics.smartComments = smartComments.length || 0;
    totalMetrics.smartCodeReviews = _getSmartCommentersCount(smartComments);
    totalMetrics.smartCommenters = _getPullRequests(smartComments);
    return totalMetrics;
    // TODO: Implementation of metrics chart.
    // For metrics chart
    // const smartCommentsByDate = {}
    // smartComments.forEach((comment) => {
    //   const formattedDate = format(new Date(comment.createdAt), 'yyyy-MM-dd')
    //   if (smartCommentsByDate[formattedDate]) {
    //     smartCommentsByDate[formattedDate].push(comment);
    //   } else {
    //     smartCommentsByDate[formattedDate] = [comment]
    //   }
    // });
    // return smartCommentsByDate
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
}

export const getTeamMembers = async (teamId, { page, perPage }, type = 'paginate') => {
  try {
    const options = {};
    if (type === 'paginate') {
      options.skip = perPage * (page - 1)
      options.limit = perPage
    }
    const members = await UserRole.find({ team: teamId }, {}, options).populate('user').populate('role')

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
    await Promise.all(users.map(async (user) => {
      const isExist = await UserRole.exists({ team, user });
      if (isExist) {
        await UserRole.updateOne({ team, user }, { role });
      } else {
        await UserRole.create({ team, user, role });
      }
    }));
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};
