const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/users');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const usersIds = data.map(({ _id }) => new ObjectId(_id));

const usersData = data.map(({
  _id,
  isActive,
  isVerified,
  isWaitlist,
  termsAccepted,
  username,
  password,
  firstName,
  lastName,
  jobTitle,
  avatarUrl,
  identities,
  verificationToken,
  verificationExpires,
  termsAcceptedAt,
  organizations,
}) => {
  const user = {
    isActive,
    isVerified,
    isWaitlist,
    termsAccepted,
    username,
    password,
    firstName,
    lastName,
    jobTitle,
    avatarUrl,
    identities,
    verificationToken,
    verificationExpires,
    termsAcceptedAt,
    organizations,
  };
  if (_id) {
    user._id = new ObjectId(_id);
  }
  return user;
});

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colUsers = mongoose.connection.db.collection('users');
    const users = await colUsers.insertMany(usersData);
    fs.writeFileSync(`${process.cwd()}/data/users.json`, JSON.stringify(users.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colComments = mongoose.connection.db.collection('users');
    await colComments.deleteMany({ _id: { $in: usersIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
