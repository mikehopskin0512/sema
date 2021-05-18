import Invitation from './invitationModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { generateToken } from '../shared/utils';

export const create = async (invitation) => {
  try {
    const {
      recipient, 
      // orgId, orgName,
      sender, senderName,
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
