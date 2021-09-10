import mongoose from 'mongoose';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { uniq } from 'lodash';
import Collection from '../src/comments/collections/collectionModel';
import { mapBooleanValue, mapTags } from '../src/shared/utils';
import EngGuide from '../src/comments/engGuides/engGuideModel';
import SuggestedComment from '../src/comments/suggestedComments/suggestedCommentModel';

import { mongooseUri } from '../src/config';

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const getCollectionIdByName = async (name) => {
  const collection = await Collection.findOne({ name });

  return collection._id;
};

const checkCollectionByName = async (name) => {
  let collection = await Collection.findOne({ name });

  if (!collection) {
    collection = new Collection({
      name,
      description: name,
      author: 'sema',
      isActive: true,
    });
    await collection.save();
  }
};

const importEngGuides = async () => {
  const buffer = fs.readFileSync('engGuides.csv');
  const workbook = XLSX.read(buffer, { type: 'buffer', raw: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  let collectionNames = [];
  rows.forEach((row) => {
    const names = row['Collections / Tag1'] ? row['Collections / Tag1'].split(';') : [];
    collectionNames = [...collectionNames, ...names];
  });
  collectionNames = uniq(collectionNames);

  await Promise.all(collectionNames.map(checkCollectionByName));

  const guides = await Promise.all(rows.map(async (item) => {
    const names = item['Collections / Tag1'] ? item['Collections / Tag1'].split(';') : [];
    const collectionIds = await Promise.all(names.map(getCollectionIdByName));
    const mappedTags = await mapTags(item['Tags All']);

    return ({
      displayId: item['Display Id'],
      title: item.Title,
      body: item['Combined Text'],
      author: item.Author,
      source: {
        name: item['Source / Tag 6'],
        url: item['Source Link'],
      },
      collections: collectionIds,
      tags: mappedTags,
      isActive: mapBooleanValue(item.Active),
    });
  }));

  await EngGuide.insertMany(guides);
};

const getEngGuideByTitle = async (title) => {
  const guide = await EngGuide.findOne({ title });
  return {
    engGuide: guide && guide._id,
    name: title,
    slug: title.split(' ').join('-'),
  };
};

const mapEngGuides = async (guidesString) => {
  if (!guidesString) return [];

  const titles = guidesString.split(';');
  const mappedEngGuides = await Promise.all(titles.map(getEngGuideByTitle));
  return mappedEngGuides.filter((item) => !!item.engGuide);
};

const importSuggestedComments = async () => {
  const buffer = fs.readFileSync('suggestedComments.csv');
  const workbook = XLSX.read(buffer, { type: 'buffer', raw: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  let collectionNames = rows.map((row) => row['Collections / Tag1']);
  collectionNames = uniq(collectionNames);
  await Promise.all(collectionNames.map(checkCollectionByName));

  await Promise.all(rows.map(async (item) => {
    const collectionId = await getCollectionIdByName(item['Collections / Tag1']);

    const comment = new SuggestedComment({
      displayId: item['Display Id'],
      title: item.Title,
      comment: item['Body / Introduction'],
      author: item.Author,
      source: {
        name: item['Source / Tag 6'],
        url: item['Source Link'],
      },
      engGuides: await mapEngGuides(item['Engineering Guides']),
      tags: await mapTags(item['Tags All']),
      isActive: mapBooleanValue(item.Active),
    });
    await comment.save();

    await Collection.updateOne({ _id: collectionId }, { $addToSet: { comments: comment._id } });
  }));
};

(async () => {
  try {
    await mongoose.connect(mongooseUri, options);
    console.log('Connected to DocumentDB successfully');
  } catch (err) {
    console.log('Error while Connecting to Apollo - Document DB', err);
  }

  try {
    console.log('Start importing!!!');
    await importEngGuides();
    await importSuggestedComments();
    console.log('End!!!');
  } catch (err) {
    console.error(err);
  }
})();
