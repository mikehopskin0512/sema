#!/usr/bin/node

const mongoose = require('mongoose');

const { mongooseUri } = require('../.././config');
const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(mongooseUri, options);

// https://stackoverflow.com/a/55251598/771112
const flattenObject = (obj) => {
  const flattened = {}
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]))
    } else {
      flattened[key] = obj[key]
    }
  })
  return flattened
}

async function getArray(docs){
/*  function(err, docs){
    if(err){
      console.log(err);
    }else{*/
      var returnArray = [];
      const results = await docs.toArray();
      for (const i in results ){
        returnArray.push(flattenObject(results[i]));
      }
      //console.log(JSON.stringify(returnArray, null, 2));
    //}
  return returnArray;
}

async function getQueriesSummary(query, collectionName){
  const collection = mongoose.connection.collection(collectionName);
  return await collection.aggregate(query);
};

async function getMetric(query, collectionName){
  return await getArray(await getQueriesSummary(query, collectionName))
}

const searchtermSummaryQuery =   [{ $match: {createdAt: {$gt: new Date(Date.now() - 604800000)}}},
   { $group: {
     _id: {'searchTerm':'$searchTerm',
           'matchedCount':'$matchedCount'},
     searchTermFrequencyCount: {$sum: 1}}},
  { "$sort": { "_id.matchedCount": 1 } },];


const waitlistCountQuery =   [
   { $group: {
     _id: {'isWaitlist':'$isWaitlist'},
     waitlistCount: {$sum: 1}}},
  { "$sort": { "waitlistCount": 1 } },] ;

const stateCountQuery =   [
   { $group: {
     _id: {'isWaitlist':'$isWaitlist',
           'isActive':'$isActive'},
     userStateCount: {$sum: 1}}},
  { "$sort": { "waitlistCount": 1 } },] ;

const invitationsQuery =   [
   { $group: {
     _id: {'isPending':'$isPending'},
     inviteCount: {$sum: 1}}},
  { "$sort": { "inviteCount": 1 } },] ;

const smartCommentsQuery =   [
   {$count: 'smartCommentCount'}] ;


async function getMetrics() {
  console.log(await getMetric(searchtermSummaryQuery, 'queries'));
  console.log(await getMetric(waitlistCountQuery, 'users'));
  console.log(await getMetric(stateCountQuery, 'users'));
  console.log(await getMetric(invitationsQuery, 'invitations'));
  console.log(await getMetric(smartCommentsQuery, 'smartComment'));
//  console.log(await getArray(await getWaitlist()));
  process.exit();
};
getMetrics();
