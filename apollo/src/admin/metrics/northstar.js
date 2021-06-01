#!/usr/bin/node

const mongoose = require('mongoose');

const { mongooseUri } = require('../../config');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(mongooseUri, options);

// https://stackoverflow.com/a/55251598/771112
const flattenObject = (obj) => {
  const flattened = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]));
    } else {
      flattened[key] = obj[key];
    }
  });
  return flattened;
};

async function getArray(docs) {
  const results = await docs.toArray();
  return results.map((aResult) => flattenObject(aResult));
}

async function getQueriesSummary(query, collectionName) {
  const collection = mongoose.connection.collection(collectionName);
  return collection.aggregate(query);
}

async function getMetric(query, collectionName) {
  return getArray(await getQueriesSummary(query, collectionName));
}

const reportCreationTime = new Date(Date.now());
const oneWeekAgo = new Date(reportCreationTime - 604800000);
const fourWeeksAgo = new Date(reportCreationTime - (4 * 604800000));

const stateCountQuery = [
  {
    $lookup: {
      from: 'smartComments',
      localField: '_id',
      foreignField: 'userId',
      as: 'smartComments',
    },
  }, {
    $project: {
      smartCommentsCount: {
        $size: '$smartComments',
      },
      isActive: '$isActive',
      isWaitlist: '$isWaitlist',
      origin: '$origin',
    },
  }, {
    $group: {
      _id: {
        isWaitlist: '$isWaitlist',
        isActive: '$isActive',
        origin: '$origin',
        smartCommentsCount: '$smartCommentsCount',
      },
      userStateCount: {
        $sum: 1,
      },
    },
  },
];

/* [
  { $group: {
     _id: {'isWaitlist':'$isWaitlist',
           'isActive':'$isActive',
          'origin':'$origin'},
     userStateCount: {$sum: 1}}}] ; */

const invitationsQuery = [
  { $group: { _id: { invitePending: '$isPending' },
    inviteCount: { $sum: 1 } } },
  { $sort: { inviteCount: 1 } }];

const smartCommentsQuery = [
  { $count: 'smartCommentCount' }];

async function getMetricsForRange(startDate, endDate, timeframe) {
  const returnObject = {
    timeframe,
    startDate,
    endDate,
    waitlistUserCount: 0,
    currentUserCount: 0, // users who have an account
    blockedUserCount: 0,
    disabledUserCount: 0,
    activeUserCount: 0, // current users who have made a smartComment?
    retentionRate: 0, // users who have accounts but have not made a smart comment = activeUserCount / currentUserCount
    pendingInviteCount: 0,
    inviteConversionRate: 0, // invites that are not pending / total invites
    waitlistConversionRate: 0, // where source is waitlist: active accounts / all accounts
    smartCommentCount: 0,
  };
  // const dateRangeMatcher = { $match: {createdAt: {$gt: startDate, $lt: endDate}}};
  const dateRangeMatcher = [{ $match: { createdAt: { $gt: startDate } } }];
  let totalWaitlistOrigin = 0;
  let activeUserCount = 0;

  (await getMetric(dateRangeMatcher.concat(stateCountQuery), 'users')).forEach((userState) => {
    //  for (const userState of await getMetric(dateRangeMatcher.concat(stateCountQuery), 'users')) {
    if (userState.isWaitlist === true && userState.isActive === true) {
      returnObject.waitlistUserCount += userState.userStateCount;
    } else if (userState.isWaitlist === false && userState.isActive === true) {
      returnObject.currentUserCount += userState.userStateCount;
    } else if (userState.isWaitlist === true && userState.isActive === false) {
      returnObject.blockedUserCount += userState.userStateCount;
    } else if (userState.isWaitlist === false && userState.isActive === false) {
      returnObject.disabledUserCount += userState.userStateCount;
    }
    if (userState.origin === 'waitlist') {
      totalWaitlistOrigin += userState.userStateCount;
    }
    if (userState.smartCommentsCount > 0) {
      activeUserCount += 1;
    }
  });
  returnObject.waitlistConversionRate = returnObject.waitlistUserCount / totalWaitlistOrigin;
  returnObject.activeUserCount = activeUserCount;
  returnObject.retentionRate = returnObject.activeUserCount / returnObject.currentUserCount;

  (await getMetric(dateRangeMatcher.concat(invitationsQuery), 'invitations')).forEach((invitationState) => {
    //  for (const invitationState of await getMetric(dateRangeMatcher.concat(invitationsQuery), 'invitations')) {
    if (invitationState.invitePending === true) {
      returnObject.pendingInviteCount = invitationState.inviteCount;
    } else if (invitationState.invitePending === false) {
      returnObject.acceptedInviteCount = invitationState.inviteCount;
    }
  });
  returnObject.inviteConversionRate = returnObject.acceptedInviteCount
    / (returnObject.acceptedInviteCount + returnObject.pendingInviteCount);

  (await getMetric(dateRangeMatcher.concat(smartCommentsQuery), 'smartComments')).forEach((smartCommentState) => {
    //  for (const smartCommentState of ) {
    returnObject.smartCommentCount = smartCommentState.smartCommentCount;
  });

  return returnObject;
}

async function getMetrics() {
  const metricsReport = JSON.stringify([
    await getMetricsForRange(new Date(0), reportCreationTime, 'Total'),
    await getMetricsForRange(oneWeekAgo, reportCreationTime, '7 Day'),
    await getMetricsForRange(fourWeeksAgo, reportCreationTime, '28 Day'),
  ], null, 2);
  return metricsReport;
}

async function printMetrics() {
  console.log(await getMetrics());
  process.exit();
}

printMetrics();
