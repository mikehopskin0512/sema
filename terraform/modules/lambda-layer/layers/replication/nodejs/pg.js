const { Pool } = require("pg");
const { getSecret } = require("./ssm");

let pool = null;

module.exports.query = async (text, params) => {
  if (pool == null) {
    const postgresConn = await getSecret(process.env.POSTGRES_CONNECTION);
    pool = new Pool({ connectionString: postgresConn });
  }

  return pool.query(text, params);
};
