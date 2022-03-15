const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const globalCollections = [
  { "collectionData" : new ObjectId("616da9b9786665013b2e8ea9"), "isActive" : true },
  { "collectionData" : new ObjectId("616da9b9786665013b2e8ea7"), "isActive" : true },
];

const removableCollections = [
  { "collectionData" : new ObjectId("6169c4674099360022e91e1e"), "isActive" : true },
];

async function changeCollections(a_collection, add_modification){
  const users = await mongoose.connection.collection('users').find({}).toArray();
  let userCount = 0;
  await Promise.all(users.map(async (a_user) => {
    for(gci in a_collection){
      let found = false;
      for (user_coll in a_user.collections){
        if((typeof(a_user.collections[user_coll]) !== 'undefined') ){ // a_collection[gci].collectionData
          if ( new String(a_user.collections[user_coll].collectionData).valueOf() == new  String(a_collection[gci].collectionData).valueOf()  ){
            found = true;
            break;
          }
        }
      }
      if(!found){
        userCount+=1;
        if(add_modification){
          await mongoose.connection.collection('users').updateOne(
            { _id: a_user._id },
            { $push: { collections: a_collection[gci] } }
          )
        }
        else {
          await mongoose.connection.collection('users').updateOne(
            { _id: a_user._id },
            { $pull: { collections: { collectionData: a_collection[gci].collectionData } } })

        }
      }
    }
  }));
  console.log("Modified " + userCount + " users");
}

async function addCollections(a_collection){
  await changeCollections(a_collection, true );
}

async function removeCollections(a_collection){
  await changeCollections(a_collection, false );
}

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    await addCollections(globalCollections);
    await removeCollections(removableCollections);
  } catch (error) {
    console.log(error);
    next(error);
  }
  await mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    await addCollections(removableCollections);
    await removeCollections(globalCollections);
  } catch (error) {
    console.log(error);
    next(error);
  }
  await mongoose.connection.close();
};
