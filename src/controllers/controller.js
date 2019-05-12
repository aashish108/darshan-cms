const db = require('../models/db');
// archiver
const fs = require('fs');
const archiver = require('archiver');
const moment = require('moment');
const fbApi = require('./helpers/fbApi');
const imageTools = require('./helpers/imageTools');

function init() {
  db.connect();
}

function addRawUploadsToDB(files, outfitDetails) {
  db.addUploadsToDB(files, outfitDetails);
}

function addProcessedUploadsToDB(files, outfitDetails) {
  db.addProcessedUploadsToDB(files, outfitDetails);
}

function getRawUploadsFromDB() {
  return db.getRawUploadsFromDB();
}

async function getRawUploadedImages(req,res) {
  const results = await getRawUploadsFromDB();
  console.log(results);
  res.render('raw-uploaded-images', { title: 'Daily Darshan Files Uploader', results: results });
  res.end();
} 

async function uploadRawImages(req, res) {
  const compressedFileOutputName = await imageTools.compressImages(req.files);
  addRawUploadsToDB(compressedFileOutputName, req.body.outfitDetails);
  res.render('uploadSuccessful', { title: 'Upload Successful', message: 'Uploaded!', req });
  console.log(req.files);
  console.log(req.body);
  res.end();
}

async function uploadProcessedImages(req, res) {
  addProcessedUploadsToDB(req.files, req.body.outfitDetails, req.body.fbPageToken);
  fbApi.urlConstruction(req.files, req.body.outfitDetails, req.body.fbPageToken);
  res.render('uploadSuccessful', { title: 'Upload Processed Images', message: 'Uploaded!', req });
  res.end();
}

module.exports = {
  init:init,
  addRawUploadsToDB,
  getRawUploadsFromDB,
  getRawUploadedImages,
  uploadRawImages,
  compressImages,
  uploadProcessedImages,
};