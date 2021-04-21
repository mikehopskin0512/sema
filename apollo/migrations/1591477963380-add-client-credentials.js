const mongoose = require('mongoose');
const fs = require('fs');
const crypto = require('crypto');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

function hash(x) {
  return crypto.createHash('sha1').update(x).digest('hex');
}

const adminUser = {
  _id: new ObjectId('54f5f63cb840e3027700001e'),
  username: 'admin',
  password: '$2a$10$x0.hsRTDwm79RtQxIh.QmOGpTi5HCi9.cE/e7hWTTWRM52PLB8mmS',
};

const clients = [{
  name: 'APOLLO-WEB',
  clientId: '3f883860-862e-4a49-b149-f56371e87e88',
  clientSecret: hash('d7f3b825-bf97-4f21-babc-cf03a1babe91'),
  userId: new ObjectId('54f5f63cb840e3027700001e'),
}];

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  const colUsers = mongoose.connection.db.collection('users');
  await colUsers.insertOne(adminUser);

  const colClients = mongoose.connection.db.collection('clients');
  await colClients.insertMany(clients);
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  const colUsers = mongoose.connection.db.collection('users');
  await colUsers.deleteOne({ _id: new ObjectId('54f5f63cb840e3027700001e') });

  const colClients = mongoose.connection.db.collection('clients');
  await colClients.deleteOne({ userId: new ObjectId('54f5f63cb840e3027700001e') });
  mongoose.connection.close();
};
