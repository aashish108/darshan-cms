const db = require('../models/db');
// archiver
const fs = require('fs');
const archiver = require('archiver');
const moment = require('moment');
const fbApi = require('./helpers/fbApi');

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
  const compressedFileOutputName = await compressImages(req.files);
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

async function createDirsIfNotExist(dirs) {
  for (dir of dirs) {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  }
  return true;
}

async function compressImages(files) {
  const aTime = Date.now();
  const fileName = `${aTime}.zip`;

  const dirs = [
    'úploads',
    'uploads/compressed_raw_images',
    'uploads/temp_raw_images',
  ];

  await createDirsIfNotExist(dirs);

  const output = fs.createWriteStream(`uploads/compressed_raw_images/${aTime}.zip`);
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
    var file1 = `./uploads/temp_raw_images/${file.filename}`;
    archive.append(fs.createReadStream(file1), { name: `${file.filename}.jpg` });
  }

  archive.finalize();
  return fileName;
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