#!/usr/bin/node

import mongoose from 'mongoose';
import User from '../../src/users/userModel';

import { mongooseUri } from '../../src/config';

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true
};

// TODO using 'throw' to find additional fields - get error if there is additional field. This option is added to original User schema
//   { timestamps: true, strict: 'throw' }

(async () => {
  try {
    const db = await mongoose.createConnection(mongooseUri, options);
    // TODO in case of failing due  to additional data uncomment this and use it to remove that field and continue debugging
    // const rsp = await db
    //   .collection('users')
    //   .updateMany({}, { $unset: { 'banners.ls': '' } });

    const users = await db
      .collection('users')
      .find()
      .toArray();

    await Promise.all(
      users.map(async userData => {
        try {
          const user = new User(userData);
          const error = user.validateSync();
          if (error) {
            console.log('up -> error', user.id, error);
          }
        } catch (e) {
          console.log('up -> e', userData._id, e);
        }
      })
    );
  } catch (e) {
    console.log(e);
  }
})();
