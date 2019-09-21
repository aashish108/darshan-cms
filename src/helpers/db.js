const mongoose = require('mongoose');
const darshanModels = require('../models/schemas');
const moment = require('moment');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'see-our-shrine-uploads'; // REPLACE WITH YOUR DB NAME

async function connect() {
  try {
    await mongoose.connect(`mongodb://${server}/${database}`);
    console.log('Database connection successful');
    return true;
  } catch {
    console.error('Database connection error');
    throw err;
  }
}

async function addUploadsToDB(files, outfitDetails) {
  const addToDB = new darshanModels.darshanRawUploads({
    time: moment().format(),
    files,
    outfitDetails,
  });
  try {
    await addToDB.save();
    console.log('Save to DB successful.')
  } catch(e) {
    console.log(e);
    throw e;
  }
}

async function addProcessedUploadsToDB(files, outfitDetails, darshanDate) {
  const addToDB = new darshanModels.darshanProcessedUploads({
    timeUploaded: moment().format(),
    files,
    outfitDetails,
    darshanDate
  });
  try {
    await addToDB.save();
    console.log('Save to DB successful.')
  } catch(e) {
    console.log(e);
    throw e;
  }
}

async function getRawUploadsFromDB() {
  try {
    return darshanModels.darshanRawUploads.find({}).sort({time: 'desc'})
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function getLatestProcessedUpload() {
  try {
    return darshanModels.darshanProcessedUploads.findOne({}).sort({_id:-1});
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
}
