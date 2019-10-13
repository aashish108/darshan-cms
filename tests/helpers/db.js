const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const darshanRawUploadsTestData = require('./darshanRawUploadsTestData');
const darshanProcessedUploadsTestData = require('./darshanProcessedUploadsTestData');
const authTestData = require('./authTestData');

let database;

const before = async () => {
  database = new MongoMemoryServer();
  return mongoose.connect(await database.getConnectionString());
};

const after = async () => {
  mongoose.disconnect();
  database.stop();
};

const setup = async () => {
  await before();
  await darshanRawUploadsTestData.init();
  await darshanProcessedUploadsTestData.init();
  await authTestData.init();
};

module.exports = { setup, before, after };
