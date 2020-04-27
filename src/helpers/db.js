const mongoose = require('mongoose');
const moment = require('moment');
const darshanModels = require('../models/schemas');
const users = require('../models/users');

const server = process.env.MONGODB_URL || '127.0.0.1';
mongoose.Promise = global.Promise;

async function connect() {
  console.log('Current environment:', process.env.ENV);
  if (process.env.ENV === 'live') {
    return mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${encodeURI(process.env.MONGODB_PASSWORD)}@${server}/${process.env.MONGODB_DATABASE}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  }
  return mongoose.connect(`mongodb://${server}/${process.env.MONGODB_DATABASE}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

async function addUploadsToDB(files, outfitDetails) {
  const addToDB = new darshanModels.DarshanRawUploads({
    time: moment().format(),
    files,
    outfitDetails,
  });
  console.log('Save to DB successful.');
  return addToDB.save();
}

async function addProcessedUploadsToDB(files, outfitDetails, darshanDate) {
  const addToDB = await new darshanModels.DarshanProcessedUploads({
    timeUploaded: moment().format(),
    files,
    outfitDetails,
    darshanDate,
  });
  return addToDB.save();
}

async function getRawUploadsFromDB() {
  return darshanModels.DarshanRawUploads.find({}).sort({ time: 'desc' });
}

async function getLatestProcessedUpload() {
  return darshanModels.DarshanProcessedUploads.find({}).sort({ darshanDate: 'desc' }).limit(1);
}

async function getTwoLatestProcessedUploads() {
  return darshanModels.DarshanProcessedUploads.find({}).sort({ darshanDate: 'desc' }).limit(2);
}

async function authUser(user, password) {
  const userFound = await users.Users.findOne({ username: user }).exec();
  if (userFound) {
    const comparePasswordCallBack = (error, isMatch) => {
      if (error) throw error;
      return isMatch;
    };
    if (await userFound.comparePassword(password, comparePasswordCallBack)) {
      return userFound;
    }
    return false;
  }
  return false;
}

async function findUser(user) {
  return await users.Users.findOne({ username: user }).exec();
}

async function findUserByID(id) {
  return users.Users.findById({ _id: id }).exec();
}

async function updateUser(username, password, roles) {
  const user = await users.Users.findOne({ username });
  user.password = password;
  user.roles = roles;
  return user.save();
}

async function getUsers() {
  return users.Users.find({});
}

async function addNewUser(username, password, roles) {
  const newUser = await new users.Users({
    username,
    password,
    roles,
  });
  return newUser.save();
}

module.exports = {
  connect,
  addUploadsToDB,
  getRawUploadsFromDB,
  addProcessedUploadsToDB,
  getLatestProcessedUpload,
  getTwoLatestProcessedUploads,
  findUser,
  findUserByID,
  authUser,
  getUsers,
  updateUser,
  addNewUser,
};
