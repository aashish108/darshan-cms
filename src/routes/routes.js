const express = require('express')
const router = express.Router();
const controller = require('../controllers/controller');

const multer  = require('multer')
const uploadRaw = multer({ dest: 'uploads/temp_raw_images' });
const uploadProcessed = multer({ dest: 'uploads/processed_images' });

router.get('/upload', function (req, res) {
  res.render('index', { title: 'Daily Darshan Files Uploader' });
  res.end();
})

router.post('/upload/process', uploadRaw.array('darshanPhotos', 30), function (req, res) {
  controller.uploadRawImages(req,res);
})

router.get('/raw-uploaded-images', function (req, res) { 
  controller.getRawUploadedImages(req,res);
})

router.get('/uploads/compressed-raw-images/:file', function (req, res) { 
  var options = {
    root: `${__basedir}/uploads/compressed`,
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = `${req.params.file}`;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
})

router.get('/upload-processed-images', function (req, res) { 
  res.render('upload-processed-images', { title: 'Daily Darshan Files Uploader' });
  res.end();
})

router.post('/upload-processed-images/process', uploadProcessed.array('processedDarshanPhotos', 30), function (req, res) { 
  controller.uploadProcessedImages(req,res);
})

module.exports = {
  router
};