import { connect } from 'getstream';

const APP_KEY = '';
const API_KEY_SECRET =
  '';
const APP_ID = '';

const client = connect(APP_KEY, API_KEY_SECRET, APP_ID);

export const getUserNotificationToken = userId => {
  return client.createUserToken(userId.toString());
};

export const getOrCreateNotificationUser = async (userId, user) => {
  // const rsp = await client.user(userId).delete();
  // console.log(
  //   '\n\n\n\n======getOrCreateNotificationUser -> user',
  //   user,
  //   '-----\n',
  //   rsp
  // );
  return client.user(userId.toString()).getOrCreate({
    profileImage: user.avatarUrl,
    name: `${user.firstName} ${user.lastName}`,
    username: user.username,
    email: user.identities[0].emails[0] // TODO change to _.get
  });
};

export const getOrCreateUserAndToken = async user => {
  const userId = user._id;
  await getOrCreateNotificationUser(userId, user);
  // const userFeed = await client.feed('notification', userId);
  // const notifications = await userFeed.get({ limit: 10 });
  // console.log('\n\n\n\n[][][]', notifications);

  return getUserNotificationToken(userId);
};

export const addUserActivity = async (
  userId,
  recepientId,
  verb,
  activityVerb = ''
) => {
  // TODO don't create every time client.feed
  const userFeed = client.feed('notification', recepientId.toString());
  // const rsp = await client.user(userId.toString()).delete();
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
