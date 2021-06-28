#!/usr/bin/node

const mongoose = require('mongoose');

const { mongooseUri } = require('../../src/config');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(mongooseUri, options);
const colQueries = mongoose.connection.collection('queries');

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

colQueries.aggregate(
  [{ $match: { createdAt: { $gt: new Date(Date.now() - 604800000) } } },
    { $group: { _id: { searchTerm: '$searchTerm',
      matchedCount: '$matchedCount' },
    searchTermFrequencyCount: { $sum: 1 } } },
    { $sort: { '_id.matchedCount': 1 } }],
  async (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      const returnArray = [];
      const results = await docs.toArray();
      results.forEach((aResult) => returnArray.push(flattenObject(aResult)));
      console.log(JSON.stringify(returnArray, null, 2));
    }
    process.exit();
  },
);
