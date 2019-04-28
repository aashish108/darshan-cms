let mongoose = require('mongoose');
const darshanUploadsModel = require('./schemas');
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
    return false;
  }
}

async function addUploadsToDB(files, outfitDetails) {
  console.log('In addUploadsToDB() in db.js.')
  const addToDB = new darshanUploadsModel({
    time: moment().format(),
    files,
    outfitDetails,
  });
  try {
    await addToDB.save();
    console.log('Save to DB successful.')
  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  connect: connect,
  addUploadsToDB: addUploadsToDB,
}
