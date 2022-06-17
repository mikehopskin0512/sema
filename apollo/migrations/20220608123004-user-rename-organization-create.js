const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

module.exports = {
  async up(db) {
    await db.collection('users').updateMany({}, {$rename: { 'banners.teamCreate': 'banners.organizationCreate' } });
  },

  async down() {
    //
  }
};
