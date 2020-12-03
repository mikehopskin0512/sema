const mongoose = require("mongoose");
const { getSecret } = require("./ssm");
const {
  createConnection,
  Schema,
  Types: { ObjectId },
} = mongoose;

let conn = null;

module.exports.getConnection = async () => {
  if (conn == null) {
    const uri = await getSecret(process.env.MONGO_PATH);
    conn = await createConnection(uri, {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    conn.model("Repositories", new Schema({}, { strict: false }));
    conn.model("Organization", new Schema({}, { strict: false }));
  }

  return conn;
};

module.exports.updateRepo = async (conn, phoenixId, legacyId) => {
  const Repo = conn.model("Repositories");

  const query = Repo.findOneAndUpdate(
    { _id: new ObjectId(phoenixId) },
    { $set: { legacyId } },
    { new: true }
  );
  const updatedRepo = await query.lean().exec();
  return updatedRepo;
};

module.exports.getLegacyOrgId = async (conn, orgId) => {
  const Org = conn.model("Organization");

  const { legacyId } = await Org.findById(new ObjectId(orgId), 'legacyId').lean().exec();
  return legacyId;
};

module.exports.updateOrg = async (conn, phoenixId, legacyId) => {
  const Org = conn.model("Organization");

  const query = Org.findOneAndUpdate(
    { _id: new ObjectId(phoenixId) },
    { $set: { legacyId } },
    { new: true }
  );
  const updatedOrg = await query.lean().exec();
  return updatedOrg;
};