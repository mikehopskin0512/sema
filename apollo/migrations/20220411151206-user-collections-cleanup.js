const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
    async up(db) {
        await db.collection('collections').deleteMany({ type: 'personal' });
        const users = await db.collection('users').find({ }).toArray();

        await Promise.all(users.map(async (user) => {
        const newCollection = await db.collection('collections').insertOne({
          name: 'My Snippets',
          comments: [],
          description: 'Have a code review comment you frequently reuse? Add it here and it will be ready for your next review.',
          author: user.username,
          type: 'personal',
          tags: [],
          createdBy: new ObjectId(user._id),
          createdAt: user.createdAt,
          updatedAt: new Date(),
        });

        const collections = [{
          collectionData: new ObjectId(newCollection.insertedId),
          isAcive: true,
          _id: new ObjectId(),
        }]
        await db.collection('users').updateOne({ _id: user._id}, {$set: { collections } });
        }));
    },
  
    async down() {
      //
    },
  };