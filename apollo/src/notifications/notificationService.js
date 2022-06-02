import { connect } from 'getstream';
import _ from 'lodash';
import { NOTIFICATION_TYPE } from '../constants';
import { getstream } from '../config';
const client = connect(
  getstream.apiKey,
  getstream.apiKeySecret,
  getstream.appId
);

const getUserNotificationToken = userId => {
  return client.createUserToken(userId.toString());
};

const getOrCreateNotificationUser = async (userId, user) => {
  return client.user(userId.toString()).getOrCreate({
    profileImage: user.avatarUrl,
    name: `${user.firstName} ${user.lastName}`,
    username: user.username,
    email: _.get(user, 'identities[0].emails[0]')
  });
};

export const getOrCreateUserAndToken = async user => {
  const userId = user._id;
  await getOrCreateNotificationUser(userId, user);
  return getUserNotificationToken(userId);
};

const addUserActivity = async (
  userId,
  recepientId,
  verb,
  activityVerb = ''
) => {
  // TODO don't create every time client.feed
  const userFeed = client.feed('notification', recepientId.toString());
  const activity_data = {
    actor: client.user(userId.toString()).ref(),
    verb,
    object: {
      verb: activityVerb
    }
  };

  const rsp = await userFeed.addActivity(activity_data);
  return rsp;
};

// ‘First_name_Last_name’ has joined Sema.
export const addAcceptedInviteActivity = async (
  userId,
  user,
  recepientId,
  recepient
) => {
  await getOrCreateNotificationUser(userId, user);
  await getOrCreateNotificationUser(recepientId, recepient);
  return addUserActivity(userId, recepientId, NOTIFICATION_TYPE.JOINED_SEMA);
};
