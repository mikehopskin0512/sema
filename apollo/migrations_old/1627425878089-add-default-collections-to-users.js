const fs = require('fs');
const mongoose = require('mongoose');
const data = require('../data/collections');
const userCollection = require('../data/removeUsersCollection');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  const collections = data.map(({ _id }) => ({ collectionData: new ObjectId(_id), isActive: true }));

  const users = await mongoose.connection.collection('users').find({}).toArray();
  try {
    const usersCollections = await Promise.all(
      users.map(async (user) => {
        const { ops: [myCollection]} = await mongoose.connection.collection('collections').insertOne({
          name: 'My Comments',
          description:
            'Create your own personal library of frequently used comments that only you will see',
          tags: [],
          comments: [],
          author: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          isActive: true,
        });
        return { userId: user._id, collections: [...collections, { collectionData: myCollection._id, isActive: true }], myCollection: myCollection._id };
      })
    );

    const data = await Promise.all(
      usersCollections.map(async ({ userId, collections, myCollection }) => {
          await mongoose.connection
           .collection('users')
           .updateOne({ _id: new ObjectId(userId) },
                      { $addToSet: { collections: { $each: collections}  }
                      }
           );
           return { userId, myCollection }
     }),
    );

    fs.writeFileSync(`${process.cwd()}/data/removeUsersCollection.json`, JSON.stringify(data));
  } catch (error) {
    throw(error);
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  const users = userCollection.map(({ userId }) => (new ObjectId(userId)));
  const usersMyCollection = userCollection.map(({ myCollection }) => (new ObjectId(myCollection)));
  try {
    await mongoose.connection.collection('collections').deleteMany({ _id: { $in: usersMyCollection } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
