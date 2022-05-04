
const fs = require('fs');
const EJSON = require('mongodb-extended-json');

module.exports = {
    async up(db) {
        const rawdata = fs.readFileSync(`${__dirname}/data/collections_null_type.json`);
        const collecionList = EJSON.parse(rawdata);

        const preparedCollecionList = collecionList.map((collection) => {
          return {
            ...collection,
            type: 'community',
            isActive: true,
          }
        });

        await db.collection('collections').insertMany(preparedCollecionList);
    },
  
    async down() {
      //
    },
  };