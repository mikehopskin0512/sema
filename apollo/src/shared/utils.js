import crypto from 'crypto';
import { orgDomain } from '../config';
import { sendEmail } from './emailService';

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

// add minutes - return in unix time
export const addMinutes = (minutes = 0, date = new Date()) => (new Date(date).getTime() + minutes * 60000);

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

export const getTokenData = (user) => {
  const tokenData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    isVerified: user.isVerified,
    isWaitlist: user.isWaitlist,
  }
  return tokenData;
}