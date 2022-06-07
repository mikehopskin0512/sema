const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    const suggestedComments = await db.collection('suggestedComments').find({}).toArray();
    const tagsFromComments = suggestedComments.map(comment => comment.tags).flat();
    let tagIds = tagsFromComments.map(tag => tag.tag.toString());
    tagIds = new Set(tagIds);
    tagIds = Array.from(tagIds);
    const tagsIdsWithoutDuplications = [];
    await Promise.all(tagIds.map(async (tagId) => {
      const tag = await db.collection('tags').find({ _id: new ObjectId(tagId) }).toArray();
      if (tag.length) {
        tagsIdsWithoutDuplications.push(tag[0]._id.toString());
      }
    }));
    const tags = await db.collection('tags').find({ type: 'other' }).toArray();
    const tagsIdsInDb = tags.map(tag => tag._id);
    const tagsForDelete = [];
    tagsIdsInDb.forEach((tagId) => {
      if (!tagsIdsWithoutDuplications.includes(tagId.toString())) {
        tagsForDelete.push(tagId);
      }
    });
    await db.collection('tags').deleteMany({ _id: { $in: tagsForDelete } });
  },

  async down() {
    
  },
};
