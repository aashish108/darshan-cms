const db = require('../helpers/db');
const fbApi = require('../helpers/fbApi');
const imageTools = require('../helpers/imageTools');
const TwitterApi = require('../helpers/twitterApi');

function init() {
  db.connect();
}

async function addRawUploadsToDB(files, outfitDetails) {
  return db.addUploadsToDB(files, outfitDetails);
}

async function addProcessedUploadsToDB(files, outfitDetails, darshanDate) {
  return db.addProcessedUploadsToDB(files, outfitDetails, darshanDate);
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
    await addRawUploadsToDB(compressedFileOutputName, req.body.outfitDetails);
    res.render('uploadSuccessful', {
      title: 'Upload Successful',
      message: 'Uploaded!',
      files: req.files,
      roles: req.user.roles,
      subDir: 'temp_raw_images',
    });
    res.end();
    return true;
  } catch (e) {
    throw new Error(e);
  }
}

async function uploadProcessedImages(files, body) {
  try {
    return addProcessedUploadsToDB(files, body.outfitDetails, body.darshanDate, body.fbPageToken);
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function getLatestProcessedUploads() {
  return getLatestProcessedUploadsFromDB();
}

async function uploadToTwitter() {
  const twitterApiInstance = new TwitterApi(await getLatestProcessedUploadsFromDB());
  twitterApiInstance.init();
}

async function getTwoLatestProcessedUploads() {
  return db.getTwoLatestProcessedUploads();
}

async function findUser(user) {
  return db.findUser(user);
}

async function findUserByID(id) {
  return db.findUserByID(id);
}

async function authUser(user, password) {
  return db.authUser(user, password);
}

function setupAdminUser() {
  db.setupAdminUser();
}

async function getUsers() {
  return db.getUsers();
}

async function updateUser(username, password, roles, res) {
  await db.updateUser(username, password, roles);
  res.redirect('/node/darshan-app/admin');
  res.end();
}

async function addNewUser(username, password, roles, res) {
  await db.addNewUser(username, password, roles);
  res.redirect('/node/darshan-app/admin');
  res.end();
}

module.exports = {
  init,
  addRawUploadsToDB,
  getRawUploadsFromDB,
  getRawUploadedImages,
  uploadRawImages,
  uploadProcessedImages,
  getLatestProcessedUploads,
  uploadToTwitter,
  getTwoLatestProcessedUploads,
  findUser,
  findUserByID,
  authUser,
  setupAdminUser,
  getUsers,
  updateUser,
  addNewUser,
};
