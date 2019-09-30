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

function getRawUploadsFromDB() {
  return db.getRawUploadsFromDB();
}

function getLatestProcessedUploadsFromDB() {
  return db.getLatestProcessedUpload();
}

async function getRawUploadedImages(req, res) {
  const results = await getRawUploadsFromDB();
  console.log(results);
  res.render('raw-uploaded-images', { title: 'Daily Darshan Files Uploader', results });
  res.end();
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

async function uploadProcessedImages(req, res) {
  addProcessedUploadsToDB(req.files, req.body.outfitDetails, req.body.darshanDate, req.body.fbPageToken);
  // fbApi.urlConstruction(req.files, req.body.outfitDetails, req.body.fbPageToken);
  res.render('uploadSuccessful', { title: 'Upload Processed Images', message: 'Uploaded!', req });
  res.end();
}

async function getProcessedUploadedImages(req, res) {
  const latestDarshanImages = await getLatestProcessedUploadsFromDB();
  console.log(latestDarshanImages);
  res.render('latest-darshan-images', { title: 'Daily Darshan Files Uploader', latestDarshanImages });
  res.end();
}

async function uploadToTwitter() {
  const twitterApiInstance = new TwitterApi(await getLatestProcessedUploadsFromDB());
  twitterApiInstance.init();
  // const data = fileSystem.readFileSync(`${__basedir}/uploads/processed_images/0d5f94559120a3a6e928c350035b22bc.jpg`);
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
