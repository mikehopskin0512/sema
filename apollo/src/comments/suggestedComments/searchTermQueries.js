#!/usr/bin/node

import mongoose from 'mongoose';
import Query from '../queryModel';

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

export const getSearchTermQuery = () => {
  return Query.aggregate(
    [
      { $match: { createdAt: { $gt: new Date(Date.now() - 604800000) } } },
      {
        $group: {
          _id: {
            searchTerm: '$searchTerm',
            matchedCount: '$matchedCount'
          },
          searchTermFrequencyCount: { $sum: 1 },
        },
      },
      { $sort: { searchTermFrequencyCount: -1, '_id.matchedCount': 1 } }
    ]
  )
};

(async () => {
  const docs = await getSearchTermQuery();
  const returnArray = [];
  docs.forEach((aResult) => returnArray.push(flattenObject(aResult)));
})();
