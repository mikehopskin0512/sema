#!/usr/bin/node

import mongoose from 'mongoose';
import Query from '../queryModel';

const { mongooseUri } = require('../../config');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(mongooseUri, options);

const getSearchTermQuery = () =>
  Query.aggregate([
    { $match: { createdAt: { $gt: new Date(Date.now() - 604800000) } } },
    {
      $group: {
        _id: {
          searchTerm: '$searchTerm',
          matchedCount: '$matchedCount',
        },
        searchTermFrequencyCount: { $sum: 1 },
      },
    },
    { $sort: { 'searchTermFrequencyCount': -1, '_id.matchedCount': 1 } },
  ]);

export default getSearchTermQuery;
