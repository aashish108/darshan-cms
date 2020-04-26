const { Router } = require('express');
const multer = require('multer');
const loggedIn = require('connect-ensure-login');
const controller = require('../controllers/controller');

const uploadProcessed = multer({ dest: 'uploads/processed_images' });
const router = Router();

router.get('/raw-uploaded-images', loggedIn.ensureLoggedIn('/node/darshan-app/login'), async (req, res) => {
  try {
    const results = await controller.getRawUploadedImages(req, res);

    res.render('raw-uploaded-images', {
      title: 'Daily Darshan Files Uploader',
      results,
      user: req.user.username,
      roles: req.user.roles,
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get('/uploads/compressed-raw-images/:file', (req, res) => {
  const options = {
    root: `${__basedir}/uploads/compressed_raw_images`,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  const fileName = `${req.params.file}`;
  res.sendFile(fileName, options, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

router.get('/upload-processed-images', loggedIn.ensureLoggedIn('/node/darshan-app/login'), (req, res) => {
  res.render('upload-processed-images', { title: 'Daily Darshan Files Uploader', user: req.user.username, roles: req.user.roles });
  res.end();
});

router.post('/upload-processed-images/process', uploadProcessed.array('processedDarshanPhotos', 30), async (req, res) => {
  const { files, body } = req;
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
});

module.exports = router;
