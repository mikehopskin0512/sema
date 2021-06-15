import mongoose from 'mongoose';
import fs from 'fs';
import * as Json2CSV from 'json2csv';
import User from '../../users/userModel';
import SmartComment from '../../comments/smartComments/smartCommentModel';
import Query from '../../comments/queryModel';
import Reaction from '../../comments/reactionModel';
import Tag from '../../comments/tagModel';
import SuggestedComment from '../../comments/suggestedComments/suggestedCommentModel';

import { mongooseUri } from '../../config';

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(mongooseUri, options);

(async () => {
  const query = { createdAt: { $gt: new Date(Date.now() - 604800000) } };

  const newUserCount = await User.countDocuments(query);
  const smartCommentsCount = await SmartComment.countDocuments(query);
  const queryTermsCount = await Query.countDocuments(query);
  const reactionsCount = await Reaction.countDocuments(query);
  const tagsCount = await Tag.countDocuments(query);
  const suggestedCommentsCount = await SuggestedComment.countDocuments(query);

  const fields = ['New Users', 'Smart Comments', 'Query Terms Searched', 'Reactions Used', 'Tags Used', 'Suggested Comments Used'];

  const { Parser } = Json2CSV;
  const json2csvParser = new Parser({ fields });

  const values = [{
    'New Users': newUserCount,
    'Smart Comments': smartCommentsCount,
    'Query Terms Searched': queryTermsCount,
    'Reactions Used': reactionsCount,
    'Tags Used': tagsCount,
    'Suggested Comments Used': suggestedCommentsCount
  }];

  const csv = json2csvParser.parse(values);

  fs.writeFileSync('activity-metric.csv', csv);
})();
