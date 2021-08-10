import { subDays } from 'date-fns';
import * as Json2CSV from 'json2csv';
import Invitation from './invitationModel';
import User from '../users/userModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { fullName, generateToken } from '../shared/utils';

export const create = async (invitation) => {
  try {
    const {
      recipient,
      // orgId, orgName,
      sender, senderName, senderEmail,
    } = invitation;

    // Generate token and expiration data (2 weeks from now)
    /* Token doesn't expire now. */
    const token = await generateToken();
    const now = new Date();
    // const tokenExpires = now.setHours(now.getHours() + (24 * 7 * 2));
    const tokenExpires = now.setHours(now.getHours() + (9999*999));

    const newInvite = new Invitation({
      recipient,
      // orgId,
      // orgName,
      sender,
      senderName,
      senderEmail,
      token,
      tokenExpires,
    });
    const savedInvite = await newInvite.save();
    return savedInvite;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const findById = async (id) => {
  try {
    const query = Invitation.findById(id);
    const invite = await query.lean().exec();
    return invite;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByToken = async (token) => {
  try {
    const query = Invitation.findOne({ token });
    const invite = await query.lean().exec();

    return invite;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const redeemInvite = async (token, userId) => {
  try {
    const query = Invitation.findOneAndUpdate({
      token, 'redemptions.user': { $ne: userId },
    },
    { $push: { redemptions: { user: userId } }, $set: { isPending: false } });
    const invite = await query.lean().exec();

    return invite;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getInvitationsBySender = async (params) => {
  try {
    const { senderId, search } = params;

    const query = Invitation.find();

    if (senderId) {
      query.where('sender', senderId);
    }

    if (search) {
      query.where('recipient', new RegExp(search, 'gi'))
    }

    const invites = await query.populate('sender').lean().exec();
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

export const deleteInvitation = async (_id) => {
  try {
    const query = Invitation.deleteOne({
      _id,
    });
    const result = await query.exec();
    return result;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const getInviteMetrics = async (type, timeRange) => {
  try {
    const startDate = subDays(new Date(), parseInt(timeRange, 10));
    const invites = await Invitation.aggregate([
      { $match: { createdAt: { $gt: startDate } } },
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
          accepted: { $sum: { $cond: { if: { $and: [ { $eq: [ "$isPending", false ] }, { $gte: [ "$tokenExpires", new Date() ] } ]  }, then: 1, else: 0 } } },
          pending: { $sum: { $cond: { if: { $and: [ { $eq: [ "$isPending", true ] }, { $gte: [ "$tokenExpires", new Date() ] } ]  }, then: 1, else: 0 } } },
          expired: { $sum: { $cond: { if: { $lt: [ "$tokenExpires", new Date() ] }, then: 1, else: 0 } } },
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

export const exportInvitations = async (params) => {
  const invites = await getInvitationsBySender(params);
  const mappedData = invites.map((item) => ({
    Sender: fullName(item.sender),
    Recipient: item.isPending ? item.recipient : fullName(item.user),
    Status: item.isPending ? 'Pending Invite' : 'Accepted',
  }));

  const { Parser } = Json2CSV;
  const fields = ['Sender', 'Recipient', 'Status'];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};
