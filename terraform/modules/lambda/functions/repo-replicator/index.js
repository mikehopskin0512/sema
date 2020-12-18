const { getConnection, getLegacyOrgId, updateRepo } = require("/opt/nodejs/mongo");
const { query } = require("/opt/nodejs/pg");

const queryText = "INSERT INTO projects(name, organization_id, repo_url) VALUES($1, $2, $3) RETURNING id";

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const db = await getConnection();
    for (const item of event.Records) {
      const { Message } = JSON.parse(item.body);
      const { repos } = JSON.parse(Message);

      console.log("Received repo input: ", JSON.stringify(Message, null, 2));

      const legacyOrgId = await getLegacyOrgId(db, repos[0].orgId);
      console.log(`Legacy Org ID is`, legacyOrgId);
      const savedRepos = await replicate(db, repos, legacyOrgId);
      console.log(`And we are done!`, JSON.stringify(savedRepos));
    }
  } catch (error) {
    console.log(`Replication execution failed`, error);
    throw error;
  }
};

const replicate = async (conn,repos, legacyOrgId) => {
  const repoPromises = repos.map(async (repo) => {
    const { rows } = await query(queryText, [repo.name, legacyOrgId, repo.cloneUrl]);
    const result = await updateRepo(conn, repo._id, rows[0].id);
    return result;
  });

  const repoResults = await Promise.allSettled(repoPromises);
  console.log(repoResults);
  // ... do some stuff
  return repoResults;
}