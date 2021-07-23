// *****************************************************************************
// **  TICKET: PHX-1129                                                       **
// **  DESCRIPTION: Sync Registered and Waitlist Users to Mailchimp           **
// **  NOTES:                                                                **
// *****************************************************************************

// 1. Execute node apollo/scripts/w1.0/w1.0_1.js

const axios = require("axios");
const mongoose = require("mongoose");

const mailchimpServerPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
const mailchimpToken = process.env.MAILCHIMP_TOKEN;
const listId = process.env.MAILCHIMP_LIST_ID;
const uri = process.env.MONGO_URI;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const config = {
  headers: {
    Authorization: `Bearer ${mailchimpToken}`,
    "Content-Type": "application/json",
  },
};

(async () => {
  try {
    await mongoose.connect(uri, options);
    console.log("Connected to DocumentDB successfully");
  } catch (err) {
    console.log("Error while Connecting to Apollo - Document DB", err);
  }

  // Get Mailchimp contacts
  const {
    data: { members },
  } = await axios.get(
    `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`,
    config
  );

  const usersId = members
    .filter(
      ({ merge_fields }) => merge_fields?.SEMA_ID && merge_fields.SEMA_ID !== ""
    )
    .map(
      ({ merge_fields: { SEMA_ID } }) => new mongoose.Types.ObjectId(SEMA_ID)
    );

  const unsyncedUsers = await mongoose.connection
    .collection("users")
    .find({ _id: { $nin: usersId } })
    .toArray();

  Promise.all(
    unsyncedUsers.map(
      async ({ _id: userId, username, firstName, lastName }) => {
        const contact = {
          list_id: listId,
          merge_fields: {
            SEMA_ID: userId.toString(),
            FNAME: firstName,
            LNAME: lastName,
          },
          status: "subscribed",
          email_type: "html",
          email_address: username,
          tags: ["Registered and Waitlist Users"],
        };

        await axios.post( `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`, contact, config );
      }
    )
  );
  
  console.log(`${unsyncedUsers.length} users were added to Mailchimp contacts and subscribed to list ${listId}`);
})();
