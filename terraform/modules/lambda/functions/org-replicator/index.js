const { getConnection, updateOrg } = require("/opt/nodejs/mongo");
const { query } = require("/opt/nodejs/pg");

const queryText = "INSERT INTO organizations(name) VALUES($1) RETURNING id";

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    for (const item of event.Records) {
      const { Message } = JSON.parse(item.body);
      const { orgName, _id } = JSON.parse(Message);

      console.log("Received org input: ", JSON.stringify(Message, null, 2));

      //add new org to SCQP
      const { rows } = await query(queryText, [orgName]);
      console.log(`SCQP replication executed successfully`, rows[0].id);

      //Add SCQP ID to Phoenix
      const db = await getConnection();
      const result = await updateOrg(db, _id, rows[0].id);
      console.log(`Replication executed successfully`, JSON.stringify(result));
    }
  } catch (error) {
    console.log(`Replication execution failed`, error);
    throw error;
  }
};