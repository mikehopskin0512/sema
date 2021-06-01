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
  //console.log(query);
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
           'isActive':'$isActive',
          'origin':'$origin'},
     userStateCount: {$sum: 1}}}] ;

const invitationsQuery =   [
   { $group: {
     _id: {'invitePending':'$isPending'},
     inviteCount: {$sum: 1}}},
  { "$sort": { "inviteCount": 1 } },] ;

const smartCommentsQuery =   [
   {$count: 'smartCommentCount'}] ;


async function getMetricsForRange( startDate, endDate, timeframe) {
  var returnObject = {'timeframe': timeframe,
                      'startDate':startDate, 'endDate':endDate,
                      'waitlistUserCount':0,
                      'currentUserCount' :0, // users who have an account
                      'blockedUserCount': 0,
                      'disabledUserCount':0,
                      'activeUserCount':0, // current users who have made a smartComment???
                      'churnRate' : 0, // users who have accounts but have not made a smart comment = activeUserCount / currentUserCount
                      'pendingInviteCount': 0,
                      'inviteConversionRate': 0, // invites that are not pending / total invites
                      'waitlistConversionRate':0, // where source is waitlist: active accounts / all accounts
                      'smartCommentCount':0
                     } ;
 // const dateRangeMatcher = { $match: {createdAt: {$gt: startDate, $lt: endDate}}};
   const dateRangeMatcher = [{ $match: {createdAt: {$gt: startDate}}}];
  var totalWaitlistOrigin = 0;
  for (const userState of await getMetric(dateRangeMatcher.concat(stateCountQuery), 'users')){
//    console.log(userState);

    if (userState['isWaitlist']===true && userState['isActive']===true){
      returnObject['waitlistUserCount'] += userState['userStateCount'];
    }else  if (userState['isWaitlist']===false && userState['isActive']===true){
      returnObject['currentUserCount'] += userState['userStateCount'];
    }else  if (userState['isWaitlist']===true && userState['isActive']===false){
      returnObject['blockedUserCount'] += userState['userStateCount'];
    }else  if (userState['isWaitlist']===false && userState['isActive']===false){
      returnObject['disabledUserCount'] += userState['userStateCount'];
    }
    if (userState['origin']==='waitlist'){
      totalWaitlistOrigin += userState['userStateCount'];
    }
  };
  returnObject['waitlistConversionRate']= returnObject['waitlistUserCount'] / totalWaitlistOrigin;

  for (const invitationState of await getMetric(dateRangeMatcher.concat(invitationsQuery), 'invitations')){
    if(invitationState['invitePending']===true){
      returnObject['pendingInviteCount']=invitationState['inviteCount'];
    }else     if(invitationState['invitePending']===false){
      returnObject['acceptedInviteCount']=invitationState['inviteCount'];
    };
  };
  returnObject['inviteConversionRate'] = returnObject['acceptedInviteCount'] / (returnObject['acceptedInviteCount'] + returnObject['pendingInviteCount']);

  for (const smartCommentState of await getMetric(dateRangeMatcher.concat(smartCommentsQuery), 'smartComments')){
    returnObject['smartCommentCount'] = smartCommentState['smartCommentCount'];
  }

  //const  =     await getMetric(smartCommentsQuery, 'smartComment');
  return returnObject;

  // [{ $match: {createdAt: {$gt: new Date(Date.now() - 604800000)}}}
//  console.log(await getArray(await getWaitlist()));
};

async function getMetrics(){
  const metricsReport = JSON.stringify([
    await getMetricsForRange(new Date(0), reportCreationTime, 'Total'),
    await getMetricsForRange(oneWeekAgo, reportCreationTime, '7 Day'),
    await getMetricsForRange(fourWeeksAgo, reportCreationTime, '28 Day')
  ], null, 2);
  return metricsReport;
}

async function printMetrics(){
  console.log(await getMetrics());
  process.exit();
}

printMetrics();
