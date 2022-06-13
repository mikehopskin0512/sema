import _ from 'lodash';
import { NOTIFICATION_TYPE } from '../constants';
import client from './notificationClient';

export const createNotificationToken = userId => {
  return client.createUserToken(userId.toString());
};

export const createUser = async user => {
  const userId = _.get(user, '_id');
  return client.user(userId.toString()).getOrCreate({
    profileImage: user.avatarUrl,
    name: `${user.firstName} ${user.lastName}`,
    username: user.username,
    email: _.get(user, 'identities[0].emails[0]')
  });
};

const addUserActivity = async (
  userId,
  recepientId,
  verb,
  activityVerb = ''
) => {
  const userFeed = client.feed('notification', recepientId.toString());
  const activityData = {
    actor: client.user(userId.toString()).ref(),
    verb,
    object: {
      verb: activityVerb
    }
  };

  return userFeed.addActivity(activityData);
};

// ‘First_name_Last_name’ has joined Sema.
export const addAcceptedInviteActivity = async (
  userId,
  user,
  recepientId,
  recepient
) => {
  const userPromise1 = createUser(user);
  const userPromise2 = createUser(recepient);
  await Promise.all([userPromise1, userPromise2]);
  return addUserActivity(userId, recepientId, NOTIFICATION_TYPE.JOINED_SEMA);
};
