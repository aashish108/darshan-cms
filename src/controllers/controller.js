const db = require('../helpers/db');
const FbApi = require('../helpers/fbApi');
const imageTools = require('../helpers/imageTools');
const TwitterApi = require('../helpers/twitterApi');
const slack = require('../helpers/slack');

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

async function uploadRawImages(files) {
  console.log('req.files', files);
  return imageTools.compressImages(files);
}

function sendSlackNotificationOnRawUploads(outfitDetails) {
  slack.sendNotification(`<!here> Raw darshan images have been uploaded. <${process.env.APP_LOGIN}|Login here>. Outfit details: ${outfitDetails}`);
}

async function uploadProcessedImages(files, body) {
  slack.sendNotification(`<!here> Processed darshan images have been uploaded for ${body.darshanDate} with outfit details: ${body.outfitDetails}`);
  return addProcessedUploadsToDB(files, body.outfitDetails, body.darshanDate);
}

async function uploadToTwitter(req, res) {
  const twitterApiInstance = new TwitterApi(await getLatestProcessedUploadsFromDB(), req, res);
  twitterApiInstance.init(res);
}

async function uploadToFacebook(req, res) {
  const fbApiInstance = new FbApi(await getLatestProcessedUploadsFromDB(), req, res);
  fbApiInstance.init();
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

async function getUsers() {
  return db.getUsers();
}

async function updateUser(username, password, roles, res) {
  await db.updateUser(username, password, roles);
  res.redirect('/darshan-app/admin');
  res.end();
}

async function addNewUser(username, password, roles, res) {
  await db.addNewUser(username, password, roles);
  res.redirect('/darshan-app/admin');
  res.end();
}

module.exports = {
  init,
  addRawUploadsToDB,
  getRawUploadsFromDB,
  uploadRawImages,
  uploadProcessedImages,
  uploadToTwitter,
  uploadToFacebook,
  getTwoLatestProcessedUploads,
  findUser,
  findUserByID,
  authUser,
  getUsers,
  updateUser,
  addNewUser,
  sendSlackNotificationOnRawUploads,
  getLatestProcessedUploadsFromDB,
};
