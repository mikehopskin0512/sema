import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

const {
  Types: { ObjectId },
} = mongoose;

const DATA_PATH = `${__dirname}/../data`;
const SEEDS = loadSeeds();

// Base seed for Apollo to work. All test should have this,
// (already provided by setup).
export async function baseSeed() {
  await Promise.all([seedReactions(), seedTags(), seedRoles()]);
}

// Imports seed data into many collections.
// Not all tests need all collections populated,
// and this is slow to do for all tests, so
// this is opt-in for now.
export async function seed() {
  await Promise.all(
    [...SEEDS.entries()].map(
      async ([name, data]) =>
        await mongoose.connection.collections[name].insertMany(data)
    )
  );
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

async function seedRoles() {
  const filename = path.join(DATA_PATH, 'rolesV2.json');
  const data = JSON.parse(fs.readFileSync(filename)).map((doc) => ({
    ...doc,
    _id: ObjectId(doc._id),
  }));
  await mongoose.connection.collections.roles.insertMany(data);
}

function loadSeeds() {
  const SEED_PATH = `${__dirname}/seed`;
  const SEED_FILES = glob.sync(`${SEED_PATH}/**/*.json`);
  return SEED_FILES.reduce((acc, filename) => {
    const name = path.basename(filename, '.json');
    acc.set(name, loadSeedFile(filename));
    return acc;
  }, new Map());
}

function loadSeedFile(filename) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  const data = JSON.parse(fs.readFileSync(filename), (key, value) => {
    const looksLikeObjectId = value?.length === 24 && objectIdRegex.test(value);
    if (looksLikeObjectId) return ObjectId(value);

    const looksLikeDate = dateRegex.test(value);
    if (looksLikeDate) return new Date(value);

    return value;
  });
  return data;
}
