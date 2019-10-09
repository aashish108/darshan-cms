const mongoose = require('mongoose');
const moment = require('moment');
const darshanModels = require('../models/schemas');

const server = 'mongo:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'see-our-shrine-uploads'; // REPLACE WITH YOUR DB NAME

async function connect() {
  try {
    await mongoose.connect(`mongodb://${server}/${database}`);
    console.log('Database connection successful');
    return true;
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

module.exports = {
  connect,
  addUploadsToDB,
  getRawUploadsFromDB,
  addProcessedUploadsToDB,
  getLatestProcessedUpload,
  getTwoLatestProcessedUploads,
};
