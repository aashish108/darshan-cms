const { Router } = require('express');
const multer = require('multer');
const loggedIn = require('connect-ensure-login');

const controller = require('../controllers/controller');

const router = Router();

const uploadRaw = multer({ dest: 'uploads/temp_raw_images' });

router.get('/upload', loggedIn.ensureLoggedIn('/darshan-app/login'), (req, res) => {
  res.render('index', { title: 'Daily Darshan Files Uploader', user: req.user.username, roles: req.user.roles });
});

router.post('/upload/process', loggedIn.ensureLoggedIn('/darshan-app/login'), uploadRaw.array('darshanPhotos', 30), (req, res) => {
  try {
    controller.uploadRawImages(req, res);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
