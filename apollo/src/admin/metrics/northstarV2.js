#!/usr/bin/node
/* eslint-disable quote-props */
/* eslint-disable no-console */

const moment = require('moment-timezone');
const mongoose = require('mongoose');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const uri = process.env.MONGO_URI;
const daysAgo = process.env.DAYS_AGO || 0;
const googleSheetId = process.env.GOOGLE_SHEET_ID;
const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY;
const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const document = new GoogleSpreadsheet(googleSheetId);
const loadCells = 'A1:L10';

// Queries
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

const invitationsQuery = [
  {
    $group: {
      _id: { invitePending: '$isPending' },
      inviteCount: { $sum: 1 },
    },
  },
  { $sort: { inviteCount: 1 } }];

const smartCommentsQuery = [{ $count: 'smartCommentCount' }];

const data = {
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
  acceptedInviteCount: 0,
};

const execute = async () => {
  // Connect to DocumentDB
  try {
    await (mongoose.connect(uri, options));
    console.log('Connect to DocumentDB successfully');
  } catch (err) {
    console.log('Error while Connecting to Apollo - Document DB', err);
  }

  // Connect to Google Sheet
  let sheet = null;
  try {
    await document.useServiceAccountAuth({
      client_email: googleClientEmail,
      private_key: googlePrivateKey.replace(/\\n/g, '\n'),
    });

    await document.loadInfo();
    [sheet] = document.sheetsByIndex;
    await sheet.loadCells(loadCells);
    console.log('Connect to GSheet successfully');
  } catch (error) {
    console.error('Error connecting to GSheet - Geckoboard', error);
  }

  // EDT Timezone
  const now = moment().tz('America/New_York');
  const midnightPlusFive = moment().tz('America/New_York').hour(0).minute(5).second(59);
  const startOfDay = moment().tz('America/New_York').subtract(daysAgo, 'days').startOf('day');

  // EDT Timezone | Start of day in EDT to UTC
  const startOfDayUTC = new Date(startOfDay.clone().tz('utc').format());
  const dateRange = [{ $match: { createdAt: { $gte: startOfDayUTC } } }];

  let totalWaitlistOrigin = 0;
  let activeUserCount = 0;

  let stateCountResult = await mongoose.connection.collection('users').aggregate([...dateRange, ...stateCountQuery]).toArray();
  stateCountResult = stateCountResult.map(({ _id, userStateCount }) => ({ ..._id, userStateCount }));

  stateCountResult.forEach(({ isWaitlist, isActive, origin, userStateCount, smartCommentsCount }) => {
    if (isWaitlist === true && isActive === true) {
      data.waitlistUserCount += userStateCount;
    } else if (isWaitlist === false && isActive === true) {
      data.currentUserCount += userStateCount;
    } else if (isWaitlist === true && isActive === false) {
      data.blockedUserCount += userStateCount;
    } else if (isWaitlist === false && isActive === false) {
      data.disabledUserCount += userStateCount;
    }
    if (origin === 'waitlist') {
      totalWaitlistOrigin += userStateCount;
    }
    if (smartCommentsCount > 0) {
      activeUserCount += 1;
    }
  });

  data.waitlistConversionRate = data.waitlistUserCount / totalWaitlistOrigin || 0;
  data.activeUserCount = activeUserCount;
  data.retentionRate = data.activeUserCount / data.currentUserCount;

  let invitationsResult = await mongoose.connection.collection('invitations').aggregate([...dateRange, ...invitationsQuery]).toArray();
  invitationsResult = invitationsResult.map(({ _id, inviteCount }) => ({ ..._id, inviteCount }));

  invitationsResult.forEach(({ invitePending, inviteCount }) => {
    if (invitePending === true) {
      data.pendingInviteCount = inviteCount || 0;
    } else if (invitePending === false) {
      data.acceptedInviteCount = inviteCount || 0;
    }
  });

  data.inviteConversionRate = data.acceptedInviteCount / (data.acceptedInviteCount + data.pendingInviteCount) || 0;

  const [{ smartCommentCount }] = await mongoose.connection.collection('smartComments').aggregate([...dateRange, ...smartCommentsQuery]).toArray();
  data.smartCommentCount = smartCommentCount;

  if (now.isBetween(startOfDay, midnightPlusFive)) {
    const [firstRow] = await sheet.getRows({ limit: 1 });
    firstRow.delete();
  }

  if (now.isAfter(midnightPlusFive)) {
    const [lastRow] = await sheet.getRows({ offset: 6 });
    await lastRow.delete();
  }

  const row = {
    'Date': moment().format('MMM DD'),
    'Waitlist': data.waitlistUserCount,
    'Current Users': data.currentUserCount,
    'Blocked Users': data.blockedUserCount,
    'Disabled Users': data.disabledUserCount,
    'Active Users': data.activeUserCount,
    'Retention Rate': data.retentionRate,
    'Pending Invites': data.pendingInviteCount,
    'Invite Conversion Rate': data.inviteConversionRate,
    'Waitlist Conversion Rate': data.waitlistConversionRate,
    'Smart Comments': data.smartCommentCount,
    'Accepted Invites': data.acceptedInviteCount,
  };

  await sheet.addRow(row);
  console.log('Done!');

  process.exit(1);
};

execute();
