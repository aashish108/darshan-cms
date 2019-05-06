const db = require('../models/db');
// archiver
const fs = require('fs');
const archiver = require('archiver');
const moment = require('moment');

function init() {
  db.connect();
}

function addRawUploadsToDB(files, outfitDetails) {
  db.addUploadsToDB(files, outfitDetails);
}

function getRawUploadsFromDB() {
  return db.getRawUploadsFromDB();
}

async function getRawUploadedImagesRoute(req,res) {
  const results = await getRawUploadsFromDB();
  console.log(results);
  res.render('raw-uploaded-images', { title: 'Daily Darshan Files Uploader', results: results });
  res.end();
}

async function uploadRawImagesRoute(req, res) {
  const compressedFileOutputName = await compressImages(req.files);
  addRawUploadsToDB(compressedFileOutputName, req.body.outfitDetails);
  res.render('uploadSuccessful', { title: 'Upload Successful', message: 'Uploaded!', req });
  console.log(req.files);
  console.log(req.body);
  res.end();
}

async function compressImages(files) {
  const aTime = Date.now();
  const fileName = `${aTime}.zip`;
  const output = fs.createWriteStream(`uploads/compressed/${aTime}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });
  output.on('end', function() { 
    console.log('Data has been drained');
  });
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });
  archive.on('error', function(err) {
    throw err;
  });
  archive.pipe(output);
  
  for (let file of files) {
    var file1 = `./uploads/${file.filename}`;
    archive.append(fs.createReadStream(file1), { name: `${file.filename}.jpg` });
  }

  archive.finalize();
  return fileName;
}

module.exports = {
  init:init,
  addRawUploadsToDB,
  getRawUploadsFromDB,
  getRawUploadedImagesRoute,
  uploadRawImagesRoute,
  compressImages,
};