const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');
const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const users = await mongoose.connection.collection('users').find({}).toArray();
    await Promise.all(users.map(async (user) => {
      if (user.origin === 'signup' || !user.origin) {
        const wasInvited = await mongoose.connection.collection('invitations').find({ recipient: user.username }).toArray();
        const origin = (!!wasInvited.length) ? 'invitation' : 'waitlist';
        await mongoose.connection.collection('users').findOneAndUpdate({ _id: new ObjectId(user._id) }, { $set: { origin } }, { upsert: true }); 
      }
    }));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.down = async (next) => {
};
