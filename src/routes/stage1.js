const { Router } = require('express');
const multer = require('multer');
const loggedIn = require('connect-ensure-login');

const controller = require('../controllers/controller');

const router = Router();

const uploadRaw = multer({ dest: 'uploads/temp_raw_images' });

router.get('/upload', loggedIn.ensureLoggedIn('/darshan-app/login'), (req, res) => {
  res.render('index', { title: 'Daily Darshan Files Uploader', user: req.user.username, roles: req.user.roles });
});

router.post('/upload/process', loggedIn.ensureLoggedIn('/darshan-app/login'), uploadRaw.array('darshanPhotos', 30), async (req, res, next) => {
  try {
    const uploads = await controller.uploadRawImages(req.files);
    await controller.addRawUploadsToDB(uploads, req.body.outfitDetails);
    controller.sendSlackNotificationOnRawUploads(req.body.outfitDetails);

    res.render('uploadSuccessful', {
      title: 'Upload Successful',
      message: 'Uploaded!',
      files: req.files,
      roles: req.user.roles,
      subDir: 'temp_raw_images',
    });
  } catch (e) {
    const error = new Error(e);
    error.statusCode = 500;
    error.shouldRedirect = true;
    next(error);
  }
});

module.exports = router;
