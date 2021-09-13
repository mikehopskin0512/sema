import mongoose from 'mongoose';
import EngGuide from '../src/comments/engGuides/engGuideModel';
import SuggestedComment from '../src/comments/suggestedComments/suggestedCommentModel';

import { mongooseUri } from '../src/config';

const getSlug = require('speakingurl');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const fixEngGuideSlugs = async () => {
  const suggestedComments = await SuggestedComment.find();
  await Promise.all(suggestedComments.map(async (suggestedComment) => {
    let newEngGuides = [];
    for (let i = 0; i < suggestedComment.engGuides.length; i++) {
      const engGuide = await EngGuide.findById(suggestedComment.engGuides[i].engGuide);
      newEngGuides.push({
        ...suggestedComment.engGuides[i],
        slug: engGuide.slug
      });
    }
    
    if (newEngGuides.length > 0) {
      suggestedComment.engGuides = newEngGuides;
      await suggestedComment.save();
    }
  }));
}

(async () => {
  try {
    await mongoose.connect(mongooseUri, options);
    console.log('Connected to DocumentDB successfully');
  } catch (err) {
    console.log('Error while Connecting to Apollo - Document DB', err);
  }
  
  try {
    console.log('Start fixing slugs!!!');
    await fixEngGuideSlugs();
    console.log('End!!!');
  } catch (err) {
    console.error(err);
  }
})();