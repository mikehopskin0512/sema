'use strict'
const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const collectionsToDelete  = [
  "6169c4674099360022e91e1e",
];

async function deleteCollectionsAndComments(collectionIds){
  let colCount = 0 ;
  for( const collectionId in collectionIds ){
    // checking for race conditions:
    await new Promise(resolve => setTimeout(resolve, 2000));
    // console.log("collectionId ------ " + collectionId);
    const colCols = await mongoose.connection.collection('collections');
    const foundCols = await colCols.find({_id: new ObjectId(collectionIds[collectionId])});
    for await (const ourCollection of foundCols){
      // console.log(ourCollection.name);
      const colComments = await mongoose.connection.collection('suggestedComments');
      await colComments.deleteMany({ _id: { $in: ourCollection.comments }});
      await colCols.deleteMany({ _id: new ObjectId(collectionIds[collectionId]) });
      colCount+=1;
      console.log("Deleted "+ourCollection.comments.length + " comments");
    }
  };
  console.log("Deleted " +colCount + " collections");
}

module.exports.up = async function (next) {
  await mongoose.connect(mongooseUri, options);
  //console.log(con);
  try {
    await deleteCollectionsAndComments(collectionsToDelete);
  } catch (error) {
    throw error;
    console.log("an errr "+error);
  }
  //await new Promise(resolve => setTimeout(resolve, 2000));
  mongoose.connection.close();
}

module.exports.down = function (next) {
  next()
}

//module.exports.up();
