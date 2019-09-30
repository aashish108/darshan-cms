const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const darshanRawUploadsTestData = require('./darshanRawUploadsTestData');
const darshanProcessedUploadsTestData = require('./darshanProcessedUploadsTestData');

let database;

const before = async () => {
  database = new MongoMemoryServer();
  mongoose.connect(await database.getConnectionString());
};

const after = async () => {
  mongoose.disconnect();
  database.stop();
};

const setup = async () => {
  await before();
  await darshanRawUploadsTestData.init();
  await darshanProcessedUploadsTestData.init();
};

module.exports = { setup, before, after };
