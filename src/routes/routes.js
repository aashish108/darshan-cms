const express = require('express')
const router = express.Router();
const controller = require('../controllers/controller');

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const con = new controller();

router.get('/upload', function (req, res) {
  res.render('index', { title: 'Daily Darshan Files Uploader' });
  res.end();
})

router.post('/upload/process', upload.array('darshanPhotos', 12), function (req, res) {
  const con = new controller(req.files, req.body.outfitDetails);
  con.init();
  res.render('upload', { title: 'Upload Successful', message: 'Uploaded!', req });
  console.log(req.files);
  console.log(req.body);
  res.end();
})

module.exports = {
  router
};