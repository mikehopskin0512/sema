#!/usr/bin/node

import mongoose from 'mongoose';
import SuggestedComment from '../../src/comments/suggestedComments/suggestedCommentModel';
import { getLinkPreviewData } from "../../src/comments/suggestedComments/suggestedCommentService";

import { mongooseUri } from '../../src/config';

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(mongooseUri, options);

(async () => {
  console.log(`\nStart handling suggested comments source URL metadata`);
  let count = 0;
  const urlPattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  const urlCache = new Map();
  
  try {
    const suggestedComments = await SuggestedComment.find({ sourceMetadata: { $exists: false } });
  
    for (let i = 0; i < suggestedComments.length; i++) {
      if (!suggestedComments[i].source?.url || !suggestedComments[i].source?.url.match(urlPattern)) {
        console.log(`Skip invalid url ${suggestedComments[i].source?.url} for ${suggestedComments[i]._id}`);
        continue;
      }
      
      if (suggestedComments[i].sourceMetadata.title) {
        continue;
      }
    
      if (urlCache.has(suggestedComments[i].source?.url)) {
        suggestedComments[i].sourceMetadata = urlCache.get(suggestedComments[i].source?.url);
      } else {
        // fetch metadata
        const metaData = await getLinkPreviewData(suggestedComments[i].source?.url);
        suggestedComments[i].sourceMetadata = metaData;
      
        // set into the urlCache
        urlCache.set(suggestedComments[i].source?.url, metaData);
      }
    
      console.log(`Updated source url metadata for ${suggestedComments[i]._id}`);
      await suggestedComments[i].save();
    
      // count
      count++;
    }
  
    console.log(`\nHandled metadata for ${count} suggested comments`);
  } catch (error) {
    console.log(`\n Error handling metadata`);
    console.log(error);
  }
  
})();
