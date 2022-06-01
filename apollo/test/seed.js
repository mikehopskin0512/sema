import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const {
  Types: { ObjectId },
} = mongoose;

const DATA_PATH = `${__dirname}/../data`;

export default async function seed() {
  await Promise.all([seedReactions(), seedTags()]);
}

async function seedReactions() {
  const filename = path.join(DATA_PATH, 'reactions.json');
  const data = JSON.parse(fs.readFileSync(filename)).map((doc) => ({
    ...doc,
    _id: ObjectId(doc._id),
  }));
  await mongoose.connection.collections.reactions.insertMany(data);
}

async function seedTags() {
  const filename = path.join(DATA_PATH, 'tags.json');
  const data = JSON.parse(fs.readFileSync(filename)).map((doc) => ({
    ...doc,
    type: 'smartComment',
    _id: ObjectId(doc._id),
  }));
  await mongoose.connection.collections.tags.insertMany(data);
}
