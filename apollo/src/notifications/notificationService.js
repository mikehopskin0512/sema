import { connect } from 'getstream';

const APP_KEY = '';
const API_KEY_SECRET =
  '';
const APP_ID = '';

const client = connect(APP_KEY, API_KEY_SECRET, APP_ID);

export const getUserNotificationToken = userId => {
  return client.createUserToken(userId);
};

export const getOrCreateNotificationUser = async (userId, user) => {
  // const rsp = await client.user(userId).delete();
  // console.log(
  //   '\n\n\n\n======getOrCreateNotificationUser -> user',
  //   user,
  //   '-----\n',
  //   rsp
  // );
  return client.user(userId).getOrCreate({
    profileImage: user.avatarUrl,
    name: `${user.firstName} ${user.lastName}`,
    username: user.username,
    email: user.identities[0].emails[0] // TODO change to _.get
  });
};

export const getOrCreateUserAndToken = async user => {
  const userId = user._id.toString();
  await getOrCreateNotificationUser(userId, user);
  // const userFeed = await client.feed('notification', userId);
  // const notifications = await userFeed.get({ limit: 10 });
  // console.log('\n\n\n\n[][][]', notifications);

  return getUserNotificationToken(userId);
};

export const addReaction = async (userId, recepientId, verb, message) => {};

export const addUserActivity = async (userId, recepientId, verb, message) => {
  // TODO don't create every time client.feed
  const userFeed = client.feed('notification', userId.toString());
  // const rsp = await client.user(userId.toString()).delete();
  const activity_data = {
    actor: client.user(userId.toString()).ref(),
    verb: 'follow',
    object: {
      // actor: client.user(userId.toString()).ref(),
      verb: 'follow',
      object: 'Alalala'
      // foreign_id: client.user(userId.toString()).ref()
    },
    message
  };

  // const activity_data = { actor: userId.toString(), verb, object: '==', message }
  // console.log('\n\n\n\n\n\nuserId.toString()', userId.toString());
  // console.log(
  //   'client.user(userId.toString()).ref()',
  //   client.user(userId.toString()).ref()
  // );

  const rsp = await userFeed.addActivity(activity_data);
  const activityId = rsp.id;
  console.log('\n\n\n:::rsp', rsp);
  const rsp2 = await client.reactions.add(
    'comment',
    activityId,
    { text: 'awesome post!' },
    { userId: userId.toString() }
  );
  console.log('\n\n\n----addUserActivity -> rsp2', rsp2);
};
