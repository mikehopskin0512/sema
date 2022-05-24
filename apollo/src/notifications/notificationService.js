import { connect } from 'getstream';

const APP_KEY = '';
const API_KEY_SECRET =
  '';
const APP_ID = '';

const client = connect(APP_KEY, API_KEY_SECRET, APP_ID, {
  location: 'us-east',
  timeout: 15000
});

export const getUserNotificationToken = userId => {
  return client.createUserToken(userId);
};

export const getOrCreateNotificationUser = (userId, user) => {
  return client.user(userId).getOrCreate({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
  });
};

export const getOrCreateUserAndToken = async (user) => {
  const userId = user._id.toString();
  await getOrCreateNotificationUser(userId, user);
  return getUserNotificationToken(userId);
};
