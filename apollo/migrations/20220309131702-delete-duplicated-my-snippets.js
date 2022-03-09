module.exports = {
  async up(db) {
    const mySnippetsCollectionName = 'My Snippets';
    const mySnippets = await db.collection('collections').find({ name: mySnippetsCollectionName }).toArray();
    const mySnippetsAuthorsByCollectionId = new Map(mySnippets.map((collection) => [collection._id.toString(), collection.author]));
    const users = await db.collection('users').find({}).toArray();

    await Promise.all(users.map(async (user) => {
      const collections = user.collections.filter((collection) => {
        const collectionId = collection.collectionData && collection.collectionData.toString();
        const isNotMySnippetsCollection = !mySnippetsAuthorsByCollectionId.has(collectionId);
        if (isNotMySnippetsCollection) {
          return true;
        }
        const collectionAuthor = mySnippetsAuthorsByCollectionId.get(collection.collectionData.toString());
        const userFullName = `${user.firstName} ${user.lastName}`;
        return collectionAuthor === userFullName;
      });
      await db.collection('users').findOneAndUpdate({ _id: user._id }, { $set: { collections } });
    }));
  },

  async down() {
    // no needed
  },
};
