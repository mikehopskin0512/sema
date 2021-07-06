/* eslint-disable quote-props */
/* eslint-disable no-console */

const mongoose = require('mongoose');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { format, zonedTimeToUtc } = require('date-fns-tz');
const { startOfToday, subDays } = require('date-fns');

const uri = process.env.MONGO_URI;
const daysAgo = parseInt(process.env.DAYS_AGO, 10) || 0;
const googleSheetId = process.env.GOOGLE_SHEET_ID;
const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY;
const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const cumulative = process.env.CUMULATIVE || false;
const startDate = process.env.START_DATE ? new Date(process.env.START_DATE) : new Date('01 January 2021 00:00 EDT');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const document = new GoogleSpreadsheet(googleSheetId);
const loadCells = 'A1:L10';

const timezone = 'America/New_York';

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

const invitationSendersCountQuery = [
  {
    $group: {
      _id: { sender: '$sender' }, 
      sender: { $sum: 1 }
    }
  }, {
    $match: {
      sender: { $gt: 0 }
    }
  }, {
    $count: 'sendersCount'
  }
];

const data = {
  waitlistUserCount: 0,
  registeredUserCount: 0, // users who have an account
  blockedUserCount: 0,
  disabledUserCount: 0,
  activeUserCount: 0, // current users who have made a smartComment?
  reviewRate: 0, // users who have accounts but have not made a smart comment = activeUserCount / registeredUserCount
  pendingInviteCount: 0,
  inviteAcceptanceConversionRate: 0, // invites that are not pending / total invites
  inviteSendingRate: 0, // ratio of users who sent at least one invite / all registered users 
  waitlistAdmitConversionRate: 0, // where source is waitlist: active accounts / all accounts
  smartCommentCount: 0,
  acceptedInviteCount: 0,
};

const execute = async () => {
  // Connect to DocumentDB
  try {
    await (mongoose.connect(uri, options));
    console.log('Connected to DocumentDB successfully');
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

    if (cumulative) {
      sheet = document.sheetsByTitle['Cumulative'];
    } else {
      if (daysAgo === 0) {
        sheet = document.sheetsByTitle['24hrs'];
      } else if (daysAgo === 7) {
        sheet = document.sheetsByTitle['7days'];
      } else if (daysAgo === 30) {
        sheet = document.sheetsByTitle['30days'];
      }
    }

    await sheet.loadCells(loadCells);
    console.log('Connected to GSheet successfully');
  } catch (error) {
    console.error('Error connecting to GSheet - Geckoboard', error);
  }

  // EDT time
  const today = format(new Date(), 'MMM d', timezone)
  const [firstRow] = await sheet.getRows({ limit: 1 });

  if (firstRow.Date !== today) {
    await sheet.addRow(firstRow);
  }

  // UTC time
  const startOfTodayUTC = subDays(zonedTimeToUtc(startOfToday(), timezone), daysAgo);
  const dateRange = [{ $match: { createdAt: { $gte: cumulative ? startDate : startOfTodayUTC } } }];

  let totalWaitlistOrigin = 0;
  let activeUserCount = 0;

  let stateCountResult = await mongoose.connection.collection('users').aggregate([...dateRange, ...stateCountQuery]).toArray();
  stateCountResult = stateCountResult.map(({ _id, userStateCount }) => ({ ..._id, userStateCount }));

  stateCountResult.forEach(({ isWaitlist, isActive, origin, userStateCount, smartCommentsCount }) => {
    if (isWaitlist === true && isActive === true) {
      data.waitlistUserCount += userStateCount;
    } else if (isWaitlist === false && isActive === true) {
      data.registeredUserCount += userStateCount;
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

  data.waitlistAdmitConversionRate = data.waitlistUserCount / totalWaitlistOrigin || 0;
  data.activeUserCount = activeUserCount;
  data.reviewRate = data.activeUserCount / data.registeredUserCount || 0;

  let invitationsResult = await mongoose.connection.collection('invitations').aggregate([...dateRange, ...invitationsQuery]).toArray();
  invitationsResult = invitationsResult.map(({ _id, inviteCount }) => ({ ..._id, inviteCount }));

  invitationsResult.forEach(({ invitePending, inviteCount }) => {
    if (invitePending === true) {
      data.pendingInviteCount = inviteCount || 0;
    } else if (invitePending === false) {
      data.acceptedInviteCount = inviteCount || 0;
    }
  });

  data.inviteAcceptanceConversionRate = data.acceptedInviteCount / (data.acceptedInviteCount + data.pendingInviteCount) || 0;

  const [{ sendersCount }] = await mongoose.connection.collection('invitations').aggregate([...dateRange, ...invitationSendersCountQuery]).toArray();
  data.inviteSendingRate = sendersCount / activeUserCount;

  const [{ smartCommentCount }] = await mongoose.connection.collection('smartComments').aggregate([...dateRange, ...smartCommentsQuery]).toArray();
  data.smartCommentCount = smartCommentCount;

  const row = {
    'Date': today,
    'Waitlist': data.waitlistUserCount,
    'Registered Users': data.registeredUserCount,
    'Blocked Users': data.blockedUserCount,
    'Disabled Users': data.disabledUserCount,
    'Active Users': data.activeUserCount,
    'Review Rate': data.reviewRate,
    'Pending Invites': data.pendingInviteCount,
    'Invite Acceptance Conversion Rate': data.inviteAcceptanceConversionRate,
    'Waitlist Admit Conversion Rate': data.waitlistAdmitConversionRate,
    'Smart Comments': data.smartCommentCount,
    'Accepted Invites': data.acceptedInviteCount,
    'Invite Sending Rate': data.inviteSendingRate,
  };

  Object.keys(row).forEach((header) => { firstRow[header] = row[header]; });
  await firstRow.save();

  console.log(`Updated sheet: ${sheet.title} with values from ${cumulative ? startDate : startOfTodayUTC}`);

  process.exit(0);
};

execute();
