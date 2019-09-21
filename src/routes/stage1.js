const { Router } = require('express');
const multer = require('multer');
const controller = require('../controllers/controller');

const router = Router();

const uploadRaw = multer({ dest: 'uploads/temp_raw_images' });

router.get('/upload', (req, res) => {
  res.render('index', { title: 'Daily Darshan Files Uploader' });
  res.end();
});

router.post('/upload/process', uploadRaw.array('darshanPhotos', 30), (req, res) => {
  controller.uploadRawImages(req, res);
});

module.exports = router;
