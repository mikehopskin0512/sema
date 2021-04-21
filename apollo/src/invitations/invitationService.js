import Invitation from './invitationModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { generateToken } from '../shared/utils';

export const create = async (invitation) => {
  try {
    const {
      recipient, orgId, orgName,
      sender, senderName,
    } = invitation;

    // Generate token and expiration data (2 weeks from now)
    const token = await generateToken();
    const now = new Date();
    const tokenExpires = now.setHours(now.getHours() + (24 * 7 * 2));

    const newInvite = new Invitation({
      recipient,
      orgId,
      orgName,
      sender,
      senderName,
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
    { $push: { redemptions: { user: userId } } });
    const invite = await query.lean().exec();

    return invite;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getInvitationsBySender = async (senderId) => {
  try {
    const query = Invitation.find({
      sender: senderId,
    });
    const result = await query.lean().exec();

    return result;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};
