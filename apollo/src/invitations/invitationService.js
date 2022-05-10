import { subDays } from 'date-fns';
import * as Json2CSV from 'json2csv';
import errors from '../shared/errors';
import logger from '../shared/logger';
import { generateToken } from '../shared/utils';
import User from '../users/userModel';
import Invitation from './invitationModel';

// TODO: it works
export const create = async (invitation) => {
  try {
    const token = await generateToken();
    /* Token doesn't expire by default. */
    const tokenExpires = invitation.expires || new Date().setFullYear(3000)
    const invite = await new Invitation({
      ...invitation,
      token,
      tokenExpires,
    }).save();
    return invite;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};
export const redeemInvite = async (userId, token) => {
  try {
    await Invitation.findOneAndUpdate(
      { token: token },
      { $push: { redemptions: { userId } }}
    ).lean().exec();
  } catch (err) {
    logger.error(err);
    return new errors.NotFound(err);
  }
};
export const findById = async (id) => {
  try {
    const invite = await Invitation.findById(id).lean().exec();
    return invite;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};
export const findByToken = async (token) => {
  try {
    const invite = await Invitation.findOne({ token }).lean().exec();
    return invite;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const checkIsInvitationValid = (invitation) => {
  if (!invitation) {
    return false
  }
  const { isMagicLink, redemptions = [], tokenExpires } = invitation;
  const isExpired = tokenExpires < Date.now();
  const isLimited = redemptions.length > 0 && !isMagicLink;
  if (isExpired) {
    return `This invitation expired on ${tokenExpires}`
  }
  if (isLimited) {
    return 'This invitation has reached it\'s invite limit';
  }
}

// TODO: it works / partially
export const getInvitationsBySender = async (params) => {
  try {
    const { senderId, search, page, perPage } = params;
    const query = Invitation.find();
    if (senderId) {
      query.where('senderId', senderId);
    }
    // TODO: haven't tried
    if (search) {
      query.where('recipient', new RegExp(search, 'gi'))
    }
    query.skip((page - 1) * perPage).limit(perPage)
    const invites = await query.populate({path: 'senderId', model: 'User' }).lean().exec();
    const recipientUsers = await User.find({ username: { $in: invites.map(invite => invite.recipient) } });
    const result = [];

    for (const invite of invites) {
      if (!invite.isPending) {
        const user = recipientUsers.find(user => user.username === invite.recipient);
        result.push({ ...invite, user });
      } else {
        result.push(invite);
      }
    }

    return result;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const getInvitationByRecipient = async (recipient) => {
  try {
    const query = Invitation.findOne({
      recipient,
    });
    const result = await query.lean().exec();
    return result;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const getInviteMetrics = async (type, timeRange) => {
  try {
    const startDate = timeRange === 'all' ? '' : subDays(new Date(), parseInt(timeRange, 10));
    const invites = await Invitation.aggregate([
      ...startDate ? [{ $match: { createdAt: { $gt: startDate } } }] : [],
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'senders',
        },
      },
      { $unwind: { path: '$senders', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          domain: { $arrayElemAt: [{ $split: ['$senders.username', '@'] }, 1] },
        },
      },
      {
        $group: {
          _id: {
            'sender': type === 'domain' ? '$domain' : '$sender',
          },
          total: { $sum: 1 },
          accepted: { $sum: { $cond: { if: { $and: [{ $eq: ["$isPending", false] }, { $gte: ["$tokenExpires", new Date()] }] }, then: 1, else: 0 } } },
          pending: { $sum: { $cond: { if: { $and: [{ $eq: ["$isPending", true] }, { $gte: ["$tokenExpires", new Date()] }] }, then: 1, else: 0 } } },
          expired: { $sum: { $cond: { if: { $lt: ["$tokenExpires", new Date()] }, then: 1, else: 0 } } },
          sender: { $first: '$senders' },
          domain: { $first: '$domain' },
        },
      },
    ]);

    return invites;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const exportInviteMetrics = async (type, timeRange) => {
  const metricData = await getInviteMetrics(type, timeRange);
  const mappedMetricData = metricData.map(item => ({
    Email: item.sender && (
      type === 'person'
        ? item.sender.username
        : item.sender.username && item.sender.username.split('@')[1]
    ),
    Name: item.sender && (
      type === 'person'
        ? `${item.sender.firstName} ${item.sender.lastName}`
        : item.sender.username && item.sender.username.split('@')[1]
    ),
    Total: item.total,
    Pending: item.pending,
    Accepted: item.accepted,
    Expired: item.expired,
  }));

  const { Parser } = Json2CSV;
  const fields = ['Email', 'Name', 'Total', 'Pending', 'Accepted', 'Expired'];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedMetricData);

  return csv;
};

// TODO: it works
export const exportInvitations = async (params) => {
  const invites = await getInvitationsBySender(params);
  const mappedData = invites.map((item) => {
    const isMagicLink = item.isMagicLink;
    const status = !!item.redemptions.length ? 'Accepted' : 'Pending Invite';
    const invitationsAvailableCount = item.redemptions.length ? 0 : 1;
    const sender = item.senderId || {};
    return {
      Sender_Email: sender.username,
      Sender: `${sender.firstName} ${sender.lastName}`,
      Recipient: isMagicLink ? 'Magic link' : item.recipient,
      Status: isMagicLink ? 'Magic link' : status,
      Invitations_Available: isMagicLink ? '-' : invitationsAvailableCount,
      Invitation_Redeemed: item.redemptions.length,
      // TODO: do we need it?
      // 'Company name': item.companyName,
      Cohort: item.cohort,
      Notes: item.notes,
      Created_At: item.createdAt
    }
  });

  const { Parser } = Json2CSV;
  const fields = [
    'Sender_Email',
    'Sender',
    'Recipient',
    'Status',
    'Invitations_Available',
    'Invitation_Redeemed',
    // TODO: do we need it?
    // 'Company name',
    'Cohort',
    'Notes',
    'Created_At',
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};
