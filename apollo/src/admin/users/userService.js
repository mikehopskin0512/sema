import User from '../../users/userModel';
import Invitation from '../../invitations/invitationModel';

export const listUsers = async (params) => {
  const { page, perPage, search, status } = params;

  const pipeline = [];
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { firstName: new RegExp(search, 'gi') },
          { lastName: new RegExp(search, 'gi') },
          { username: new RegExp(search, 'gi') },
          { 'identities.email': new RegExp(search, 'gi') },
        ],
      },
    })
  }

  if (status) {
    const statusQuery = [];

    status.forEach((item) => {
      if (item === 'Waitlisted') {
        statusQuery.push({ isActive: true, isWaitlist: true });
      } else if (item === 'Active') {
        statusQuery.push({ isActive: true, isWaitlist: false });
      } else if (item === 'Blocked') {
        statusQuery.push({ isActive: false, isWaitlist: true });
      } else if (item === 'Disabled') {
        statusQuery.push({ isActive: false, isWaitlist: false });
      }
    });

    pipeline.push({
      $match: {
        $or: statusQuery,
      },
    });
  }

  pipeline.push({
    $lookup: {
      from: 'invitations',
      localField: '_id',
      foreignField: 'sender',
      as: 'invitations',
    }
  });
  const totalCount = await User.aggregate([
    ...pipeline,
    { $count: 'total' }
  ]);

  const users = await User.aggregate([
    ...pipeline,
    {
      $addFields: {
        invitedCount: { $size: '$invitations' },
        pendingCount: {
          $size: {
            $filter: {
              input: '$invitations',
              as: 'item',
              cond: { $eq: [ '$$item.isPending', true ] }
            }
          }
        },
        acceptCount: {
          $size: {
            $filter: {
              input: '$invitations',
              as: 'item',
              cond: { $eq: [ '$$item.isPending', false ] }
            }
          }
        }
      }
    },
    { $sort: { invitedCount: -1 } },
    { $skip: (page - 1) * perPage },
    { $limit: perPage }
  ]);

  return {
    users,
    totalCount: totalCount[0]? totalCount[0].total : 0,
  };
};

export const findUser = async (userId) => {
  const user = await User.findById(userId);

  return user;
};

export const updateUserAvailableInvitesCount = async (id, params) => {
  const { amount } = params;

  const user = await User.findById(id);

  user.inviteCount += amount;

  if (user.inviteCount < 0) user.inviteCount = 0;

  await user.save();
};

export const updateUserStatus = async (id, params) => {
  const { key, value } = params;

  const user = await User.findById(id);
  user[key] = value;
  await user.save();
  return { user };
};

export const getFilterMetrics = async (search) => {
  const query = search ? {
    $or: [
      { firstName: new RegExp(search, 'gi') },
      { lastName: new RegExp(search, 'gi') },
      { username: new RegExp(search, 'gi') },
      { 'identities.email': new RegExp(search, 'gi') },
    ],
  } : {};

  const total = await User.countDocuments(query);
  const active = await User.countDocuments({ ...query, isActive: true, isWaitlist: false });
  const waitlist = await User.countDocuments({ ...query, isActive: true, isWaitlist: true });
  const blocked = await User.countDocuments({ ...query, isActive: false, isWaitlist: true });
  const disabled = await User.countDocuments({ ...query, isActive: false, isWaitlist: false });

  return { total, active, waitlist, blocked, disabled };
};

export const bulkAdmitUsers = async (bulkCount) => {
  const users = await User.find({ isActive: true, isWaitlist: true }).select('_id').sort('createdAt').limit(parseInt(bulkCount, 10));

  const userIds = users.map(item => item._id);

  await User.updateMany({ _id: { $in: userIds } }, { $set: { isWaitlist: false } });
};
