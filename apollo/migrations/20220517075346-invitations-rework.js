const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db, client) {
    try {
      const invitations = await db.collection('invitations')
        .find({})
        .toArray();

      await Promise.all(invitations.map(async (invite) => {
        const {_id, sender, team, token, tokenExpires, redemptions, createdAt, updatedAt, isMagicLink, senderId, teamId } = invite;
        const formattedInvite = {
          _id,
          senderId: senderId ?? sender,
          isMagicLink: isMagicLink ?? false,
          organizationId: teamId ?? team,
          token,
          tokenExpires,
          redemptions,
          createdAt,
          updatedAt
        };

        await db.collection('invitations')
          .findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: formattedInvite }, { new: true });
      }));
    } catch (e) {
      console.log(e);
    }
  },

  async down(db, client) {},
};
