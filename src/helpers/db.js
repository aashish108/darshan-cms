const mongoose = require('mongoose');
const moment = require('moment');
const darshanModels = require('../models/schemas');
const users = require('../models/users');

const server = process.env.MONGODB_URL || '127.0.0.1';
mongoose.Promise = global.Promise;

async function connect() {
  try {
    console.log('process.env.ENV', process.env.ENV);
    if (process.env.ENV === 'live') {
      return await mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${encodeURI(process.env.MONGODB_PASSWORD)}@${server}/${process.env.MONGODB_DATABASE}`, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    }
    console.log('For some reason, 2nd connect to DB is being called.');
    return await mongoose.connect(`mongodb://${server}/${process.env.MONGODB_DATABASE}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (e) {
    console.error('Database connection error');
    throw e;
  }
}

async function addUploadsToDB(files, outfitDetails) {
  const addToDB = new darshanModels.DarshanRawUploads({
    time: moment().format(),
    files,
    outfitDetails,
  });
  try {
    await addToDB.save();
    console.log('Save to DB successful.');
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function addProcessedUploadsToDB(files, outfitDetails, darshanDate) {
  const addToDB = await new darshanModels.DarshanProcessedUploads({
    timeUploaded: moment().format(),
    files,
    outfitDetails,
    darshanDate,
  });
  try {
    return addToDB.save();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function getRawUploadsFromDB() {
  try {
    return darshanModels.DarshanRawUploads.find({}).sort({ time: 'desc' });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function getLatestProcessedUpload() {
  try {
    return darshanModels.DarshanProcessedUploads.find({}).sort({ _id: -1 }).limit(1);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function getTwoLatestProcessedUploads() {
  try {
    return darshanModels.DarshanProcessedUploads.find({}).sort({ _id: -1 }).limit(2);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function authUser(user, password) {
  try {
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
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function findUser(user) {
  try {
    return users.Users.findOne({ username: user }).exec();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function findUserByID(id) {
  try {
    return users.Users.findById({ _id: id }).exec();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function setupAdminUser() {
  const newAdminUser = await new users.Users({
    username: process.env.ADMIN_USER_NAME,
    password: process.env.ADMIN_PASSWORD,
  });
  try {
    await newAdminUser.save();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function updateUser(username, password, roles) {
  const user = await users.Users.findOne({ username });
  user.password = password;
  user.roles = roles;
  try {
    await user.save();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function getUsers() {
  try {
    return users.Users.find({});
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function addNewUser(username, password, roles) {
  const newUser = await new users.Users({
    username,
    password,
    roles,
  });
  try {
    await newUser.save();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
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
  setupAdminUser,
  getUsers,
  updateUser,
  addNewUser,
};
