const { Router } = require('express');
const multer = require('multer');
const loggedIn = require('connect-ensure-login');
const controller = require('../controllers/controller');

const uploadProcessed = multer({ dest: 'uploads/processed_images' });
const router = Router();

router.get('/raw-uploaded-images', loggedIn.ensureLoggedIn('/darshan-app/login'), async (req, res, next) => {
  try {
    const results = await controller.getRawUploadsFromDB();

    res.render('raw-uploaded-images', {
      title: 'Daily Darshan Files Uploader',
      results,
      user: req.user.username,
      roles: req.user.roles,
    });
  } catch (e) {
    const error = new Error(e);
    error.statusCode = 500;
    error.shouldRedirect = true;
    next(error);
  }
});

router.get('/darshan-app/uploads/compressed-raw-images/:file', (req, res, next) => {
  const options = {
    root: `${__basedir}/darshan-app/uploads/compressed_raw_images`,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  const fileName = `${req.params.file}`;
  res.sendFile(fileName, options, (e) => {
    if (e) {
      console.log(e);
      const error = new Error(e);
      error.statusCode = 500;
      error.shouldRedirect = true;
      next(error);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

router.get('/upload-processed-images', loggedIn.ensureLoggedIn('/darshan-app/login'), (req, res) => {
  res.render('upload-processed-images', { title: 'Daily Darshan Files Uploader', user: req.user.username, roles: req.user.roles });
});

router.post('/upload-processed-images/process', uploadProcessed.array('processedDarshanPhotos', 30), async (req, res, next) => {
  const { files, body } = req;
  try {
    const result = await controller.uploadProcessedImages(files, body);
    console.log('result', result);
    if (result) {
      res.render('uploadSuccessful', {
        title: 'Upload Processed Images',
        message: 'Uploaded!',
        files: result.files,
        roles: req.user.roles,
        subDir: 'processed_images',
      });
    } else {
      res.render('uploadSuccessful', { title: 'Upload Processed Images', message: 'Upload failed' });
    }
  } catch (e) {
    const error = new Error(`Upload failed: ${e}`);
    error.statusCode = 500;
    error.shouldRedirect = true;
    next(error);
  }
});

module.exports = router;
