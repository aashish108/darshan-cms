const db = require('../helpers/db');
const fbApi = require('../helpers/fbApi');
const imageTools = require('../helpers/imageTools');
const TwitterApi = require('../helpers/twitterApi');

function init() {
  db.connect();
}

function addRawUploadsToDB(files, outfitDetails) {
  db.addUploadsToDB(files, outfitDetails);
}

function addProcessedUploadsToDB(files, outfitDetails, darshanDate) {
  db.addProcessedUploadsToDB(files, outfitDetails, darshanDate);
}

async function getRawUploadsFromDB() {
  return db.getRawUploadsFromDB();
}

async function getLatestProcessedUploadsFromDB() {
  return db.getLatestProcessedUpload();
}

async function getRawUploadedImages() {
  return getRawUploadsFromDB();
}

async function uploadRawImages(req, res) {
  try {
    const compressedFileOutputName = await imageTools.compressImages(req.files);
    addRawUploadsToDB(compressedFileOutputName, req.body.outfitDetails);
    res.render('uploadSuccessful', { title: 'Upload Successful', message: 'Uploaded!', req });
    res.end();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function uploadProcessedImages(req) {
  try {
    await addProcessedUploadsToDB(req.files, req.body.outfitDetails, req.body.darshanDate, req.body.fbPageToken);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function getProcessedUploadedImages() {
  try {
    return getLatestProcessedUploadsFromDB();
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function uploadToTwitter() {
  const twitterApiInstance = new TwitterApi(await getLatestProcessedUploadsFromDB());
  twitterApiInstance.init();
}

module.exports = {
  init,
  addRawUploadsToDB,
  getRawUploadsFromDB,
  getRawUploadedImages,
  uploadRawImages,
  uploadProcessedImages,
  getProcessedUploadedImages,
  uploadToTwitter,
};
