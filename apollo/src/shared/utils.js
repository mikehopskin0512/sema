import crypto from 'crypto';
import { orgDomain, semaCorporateTeamId } from '../config';
import { sendEmail } from './emailService';
import Tag from '../comments/tags/tagModel';
import UserRole from '../userRoles/userRoleModel';
import { isEmpty } from 'lodash';

export const handle = (promise) => promise
  .then((data) => ([data, undefined]))
  .catch((error) => Promise.resolve([undefined, error]));

export const delay = async (ms) => {
  // return await for better async stack trace support in case of errors.
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateToken = () => new Promise((resolve, reject) => {
  crypto.randomBytes(20, (ex, buffer) => {
    if (ex) {
      reject();
    }
    const token = crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex');
    resolve(token);
  });
});

export const checkAndSendEmail = async (user) => {
  const { username, isWaitlist = true, lastLogin } = user;
  const re = /\S+@\S+\.\S+/;
  const isEmail = re.test(username);
  if (isEmail && !lastLogin) {
    const message = {
      recipient: username,
      url: `${orgDomain}`,
      templateName: !isWaitlist ? 'accountCreated' : 'waitlisted',
    };
    await sendEmail(message);
  }
};

export const fullName = (user) => {
  if (!user) return '';
  return `${user.firstName || ''} ${user.lastName || ''}`;
};

export const getTokenData = async (user) => {
  const roles = await UserRole.find({ user: user._id })
    .populate('team')
    .populate('role');

  // user fields on jwt.
  const tokenData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    isVerified: user.isVerified,
    isWaitlist: user.isWaitlist,
    isSemaAdmin: user.isSemaAdmin,
    lastLogin: user.lastLogin,
    roles,
  };

  return tokenData;
};

export const isSemaAdmin = (userData) => {
  const semaAdminRole = userData?.roles?.find((userRole) => userRole?.team?._id == semaCorporateTeamId && userRole?.role?.name === 'Admin');
  return !!semaAdminRole;
}

export const mapBooleanValue = (value) => value.toLowerCase() === 'true';

export const mapTags = async (tagsString) => {
  if (!tagsString) return [];

  const tags = tagsString.split(';');

  const mappedTags = await Promise.all(tags.map(async (tag) => {
    const existTag = await Tag.findOne({ label: tag });

    if (existTag) {
      return {
        type: existTag.type,
        label: tag,
        tag: existTag._id,
      };
    }

    const newTag = new Tag({ label: tag, type: 'other' });
    await newTag.save();

    return {
      label: tag,
      type: 'other',
      id: newTag._id,
    };
  }));

  return mappedTags;
};

export const _checkPermission = (teamId = '', permission, user) => {
  if (teamId && permission) {
    const role = user?.roles?.find((item) => item.role && item.role[permission] && item?.team?._id == teamId);
    if (role) {
      return true
    }
  }
  if (permission) {
    if (!isEmpty(user.roles.team)) {
      const role = user?.roles?.find((item) => item.role && item.role[permission]);
      if (role) {
        return true
      }
    }
  }
  return false
}
