import {
  addHours,
  addDays,
  addWeeks,
  isBefore,
  subYears,
  isAfter,
  isEqual,
  format,
  isDate,
  formatDistanceToNowStrict
} from 'date-fns';
import * as Json2CSV from 'json2csv';
import User from '../../users/userModel';
import { fullName } from '../../shared/utils';
import { suggest } from '../../comments/suggestedComments/commentSuggestions';
import Reaction from '../../comments/reaction/reactionModel';
import UserRole from '../../userRoles/userRoleModel';
import Organization from '../../organizations/organizationModel';
import Role from '../../roles/roleModel';

export const listUsers = async (params, listAll = false) => {
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
      } else if (item === 'Registered') {
        statusQuery.push({ isActive: true, isWaitlist: false });
      } else if (item === 'Blocked') {
        statusQuery.push({ isActive: false, isWaitlist: true });
      } else if (item === 'Disabled') {
        statusQuery.push({ isActive: false, isWaitlist: false });
      }
    });

    if (statusQuery.length) {
      pipeline.push({
        $match: {
          $or: statusQuery,
        },
      });
    }
  }

  const totalCount = await User.aggregate([
    ...pipeline,
    { $count: 'total' }
  ]);

  const users = await User.aggregate([
    ...pipeline,
    {
      $lookup: {
        from: 'invitations',
        localField: '_id',
        foreignField: 'sender',
        as: 'invitations',
      }
    },
    {
      $lookup: {
        from: 'userroles',
        localField: '_id',
        foreignField: 'user',
        as: 'userRole',
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'userRole.organization',
        foreignField: '_id',
        as: 'organizations',
      }
    },
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
    ...!listAll ? [
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
    ] : [],
  ]);

  return {
    users,
    totalCount: totalCount[0] ? totalCount[0].total : 0,
  };
};

export const exportUsers = async (params) => {
  const { users } = await listUsers(params, true);

  const mappedData = users.map((user) => ({
    _id: user._id,
    'First Name': user.firstName,
    'Last Name': user.lastName,
    'Combined Name': fullName(user),
    'Email': user.username,
    'Email handle': user.username ? user.username.split('@')[1] : '',
    'AvatarUrl': user.avatarUrl,
    'Collections': JSON.stringify(user.collections),
    'Invite Count': user.inviteCount,
    'isActive': user.isActive,
    'isSemaAdmin': user.isSemaAdmin,
    'isVerified': user.isVerified,
    'isWaitlist': user.isWaitlist,
    'JobTitle': user.jobTitle,
    'LastLogin': user.lastLogin,
    'Organizations': JSON.stringify(user.organizations),
    'Origin': user.origin,
    'TermsAccepted': user.termsAccepted,
    'TermsAcceptedAt': user.termsAcceptedAt,
    'CreatedAt': user.createdAt,
    'UpdatedAt': user.updatedAt,
    'Week of signup': user.createdAt ? `${format(user.createdAt, 'yyyy.ww', {firstWeekContainsDate: 4, weekStartsOn: 1})} ` : '',
    'CompanyName': user.companyName,
    'Cohort': user.cohort,
    'Notes': user.notes,
  }));

  const { Parser } = Json2CSV;

  const fields = [
    '_id',
    'First Name',
    'Last Name',
    'Combined Name',
    'Email',
    'Email handle',
    'AvatarUrl',
    'Collections',
    'Invite Count',
    'isActive',
    'isSemaAdmin',
    'isVerified',
    'isWaitlist',
    'JobTitle',
    'LastLogin',
    'Organizations',
    'Origin',
    'TermsAccepted',
    'TermsAcceptedAt',
    'CreatedAt',
    'UpdatedAt',
    'Week of signup',
    'CompanyName',
    'Cohort',
    'Notes',
  ];

  const json2csvParser = new Parser({ fields, delimiter: ',' });
  const csv = json2csvParser.parse(mappedData);
  return csv;
};

export const findUser = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'collections.collectionData',
    model: 'Collection',
  });

  const roles = await UserRole.find({ user: userId })
    .populate('organization')
    .populate('role');
  return { ...user.toJSON(), roles };
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

  users.forEach(async user => {
    const { username } = user;
    const invitations = await checkIfInvited(username);

    invitations.forEach(async invitation => {
      await deleteInvitation(invitation._id);
      if (invitation.sender) {
        await revokeInvitation(invitation.senderEmail);
      }
    })
  })
};

export const getTimeToValueMetric = async (params, isExport = false) => {
  const { page, perPage, range = 'first_hour' } = params;

  const getLimitDate = (date) => {
    switch (range) {
      case 'first_hour':
        return addHours(new Date(date), 1);
      case 'first_day':
        return addDays(new Date(date), 1);
      case 'first_week':
        return addWeeks(new Date(date), 1);
      default:
        return date;
    }
  };

  const totalCount = await User.countDocuments();
  const results = await User.aggregate([
    {
      $lookup: {
        from: 'smartComments',
        let: { userId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
          {
            $lookup: {
              from: 'tags',
              let: { tags: '$tags' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$tags'] } } },
              ],
              as: 'tags',
            }
          }
        ],
        as: 'smartComments',
      },
    },
    {
      $lookup: {
        from: 'suggestedComments',
        localField: 'smartComments.suggestedComments',
        foreignField: '_id',
        as: 'suggestedComments',
      },
    },
    { $sort: { createdAt: -1 } },
    ...!isExport ? [
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
    ] : [],
  ]);

  const metricData = [];
  await Promise.all(results.map(async (user) => {
    const limitDate = getLimitDate(user.createdAt);
    const minDate = subYears(user.createdAt, 1);
    const saveCommentAt = user.smartComments.reduce((date, comment) => (isBefore(date, comment.createdAt)
      && isBefore(comment.createdAt, limitDate) && isAfter(comment.createdAt, user.createdAt)
      ? comment.createdAt
      : date),
      minDate);
    const insertSuggestedCommentAt = user.suggestedComments.reduce((date, comment) => (isBefore(date, comment.createdAt)
      && isBefore(comment.createdAt, limitDate) && isAfter(comment.createdAt, user.createdAt)
      ? comment.createdAt
      : date),
      minDate);

    let changeReaction = false;
    let changeTags = false;

    await Promise.all(user.smartComments.map(async (smartComment) => {
      const { suggestReaction, suggestedTags } = suggest(smartComment.comment);
      if (suggestReaction && suggestReaction._id.toString() !== smartComment.reaction.toString()) {
        const reaction = await Reaction.findById(suggestReaction._id);
        if (!changeReaction || isBefore(changeReaction, reaction.createdAt)) {
          changeReaction = true;
        }
      }
      if (suggestedTags && suggestedTags.sort().join('') !== smartComment.tags.map((item) => item.label).sort().join('')) {
        changeTags = true;
      }
    }));

    metricData.push({
      id: user._id,
      name: fullName(user),
      leaveWaitlist: user.isWaitlist,
      acceptInvite: user.isActive,
      lastLogin: user.lastLogin,
      saveCommentAt: isEqual(saveCommentAt, minDate) ? undefined : saveCommentAt,
      insertSuggestedCommentAt: isEqual(insertSuggestedCommentAt, minDate) ? undefined : insertSuggestedCommentAt,
      changeReaction,
      changeTags,
      countOfSmartComments: user.smartComments.length,
    });
  }));

  return { metric: metricData, totalCount };
};

export const exportTimeToValueMetric = async (params) => {
  try {
    const { metric } = await getTimeToValueMetric(params, true);

    const mappedData = metric.map((item) => ({
      Name: item.name,
      'Leave waitlist': item.leaveWaitlist ? 'Yes' : 'No',
      'Accept invite': item.acceptInvite ? 'Yes' : 'No',
      'Last login': item.lastLogin ? format(new Date(item.lastLogin), 'yyyy-MM-dd hh:mm:ss') : '',
      'Save smartComment': isDate(item.saveCommentAt) ? format(new Date(item.saveCommentAt), 'yyyy-MM-dd hh:mm:ss') : '',
      'Insert suggested comment': isDate(item.insertSuggestedCommentAt) ? format(new Date(item.insertSuggestedCommentAt), 'yyyy-MM-dd hh:mm:ss') : '',
      'Manually change reaction': item.changeReaction ? 'Yes' : 'No',
      'Manually Change tag': item.changeTags ? 'Yes' : 'No',
      '# of smart comments': item.countOfSmartComments,
    }));

    const { Parser } = Json2CSV;
    const fields = [
      'Name',
      'Leave waitlist',
      'Accept invite',
      'Last login',
      'Save smartComment',
      'Insert suggested comment',
      'Manually change reaction',
      'Manually Change tag',
      '# of smart comments'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(mappedData);
    return csv;
  } catch (err) {
    console.error(err);
  }
};
