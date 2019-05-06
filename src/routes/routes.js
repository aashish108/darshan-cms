const express = require('express')
const router = express.Router();
const controller = require('../controllers/controller');

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

router.get('/upload', function (req, res) {
  res.render('index', { title: 'Daily Darshan Files Uploader' });
  res.end();
})

router.post('/upload/process', upload.array('darshanPhotos', 30), function (req, res) {
  controller.uploadRawImagesRoute(req,res);
})

router.get('/raw-uploaded-images', function (req, res) { 
  controller.getRawUploadedImagesRoute(req,res);
})

module.exports = {
  router
};