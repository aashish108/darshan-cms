const express = require('express')
const router = express.Router();
const controller = require('../controllers/controller');

const multer  = require('multer')
const upload = multer({ dest: 'uploads/temp_raw_images' });

router.get('/upload', function (req, res) {
  res.render('index', { title: 'Daily Darshan Files Uploader' });
  res.end();
})

router.post('/upload/process', upload.array('darshanPhotos', 30), function (req, res) {
  controller.uploadRawImages(req,res);
})

router.get('/raw-uploaded-images', function (req, res) { 
  controller.getRawUploadedImages(req,res);
})

router.get('/uploads/compressed/:file', function (req, res) { 
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

module.exports = {
  router
};