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
  console.log(query);
  return await getArray(await getQueriesSummary(query, collectionName))
//  return JSON.stringify(await getQueriesSummary(query, collectionName));
}

const reportCreationTime = new Date(Date.now());
const oneWeekAgo = new Date(reportCreationTime - 604800000);
const fourWeeksAgo = new Date(reportCreationTime - (4*604800000));

const searchtermSummaryQuery =   [{ $match: {createdAt: {$gt: new Date(Date.now() - 604800000)}}},
   { $group: {
     _id: {'searchTerm':'$searchTerm',
           'matchedCount':'$matchedCount'},
     searchTermFrequencyCount: {$sum: 1}}}
                                ];

const stateCountQuery =   [
   { $group: {
     _id: {'isWaitlist':'$isWaitlist',
           'isActive':'$isActive'},
     userStateCount: {$sum: 1}}},
  { "$sort": { "waitlistCount": 1 } },] ;

const invitationsQuery =   [
   { $group: {
     _id: {'invitePending':'$isPending'},
     inviteCount: {$sum: 1}}},
  { "$sort": { "inviteCount": 1 } },] ;

const smartCommentsQuery =   [
   {$count: 'smartCommentCount'}] ;


async function getMetricsForRange( startDate, endDate) {
  var returnObject = {'startDate':startDate, 'endDate':endDate} ;
  const dateRangeMatcher = { $match: {createdAt: {$gt: startDate, $lt: endDate}}};
//  console.log(dateRangeMatcher);
//  const dateRangeMatcher = {} ; // $match: {createdAt: {$gt: startDate, $lt: endDate}}};

  for (const userState of await getMetric(stateCountQuery.concat(dateRangeMatcher), 'users')){
    console.log(userState);
    if (userState['isWaitlist']===true && userState['isActive']===true){
      returnObject['activeUserCount'] = userState['userStateCount'];
    }else  if (userState['isWaitlist']===false && userState['isActive']===true){
      returnObject['waitlistUserCount'] = userState['userStateCount'];
    }else  if (userState['isWaitlist']===true && userState['isActive']===false){
      returnObject['blockedUserCount'] = userState['userStateCount'];
    }else  if (userState['isWaitlist']===false && userState['isActive']===false){
      returnObject['disabledUserCount'] = userState['userStateCount'];
    }
  };
  for (const invitationState of await getMetric(invitationsQuery.concat(dateRangeMatcher), 'invitations')){
    if(invitationState['invitePending']===true){
      returnObject['pendingInviteCount']=invitationState['inviteCount'];
    }else     if(invitationState['invitePending']===false){
      returnObject['acceptedInviteCount']=invitationState['inviteCount'];
    };
  };
  for (const smartCommentState of await getMetric(smartCommentsQuery.concat(dateRangeMatcher), 'smartComment')){
    returnObject['smartCommentCount'] = smartCommentState['smartCommentCount'];
  }

  //const  =     await getMetric(smartCommentsQuery, 'smartComment');
  return returnObject;

  // [{ $match: {createdAt: {$gt: new Date(Date.now() - 604800000)}}}
//  console.log(await getArray(await getWaitlist()));
};

async function getMetrics(){
  const metricsReport = JSON.stringify([
    await getMetricsForRange( 0, reportCreationTime),
    await getMetricsForRange( oneWeekAgo, reportCreationTime),
    await getMetricsForRange(fourWeeksAgo, reportCreationTime)
  ]);
  console.log(metricsReport);
  process.exit();
}

getMetrics();
