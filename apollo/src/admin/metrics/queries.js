#!/usr/bin/node

const mongoose = require('mongoose');

const { mongooseUri } = require('../.././config');
const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(mongooseUri, options);
const colQueries = mongoose.connection.collection('queries');

colQueries.aggregate(
  [{$match: {createdAt: {$gt: new Date(Date.now() - 604800000)}}},
   { $group: {
    _id: '$searchTerm',
    count: {$sum: 1}
  }}],
  async function(err, docs){
    if(err){
      console.log(err);
    }else{
      console.log(await docs.toArray());
    }
    process.exit();
  }
);
