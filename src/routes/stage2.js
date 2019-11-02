const { Router } = require('express');
const multer = require('multer');
const loggedIn = require('connect-ensure-login');
const controller = require('../controllers/controller');

const uploadProcessed = multer({ dest: 'uploads/processed_images' });
const router = Router();

router.get('/raw-uploaded-images', loggedIn.ensureLoggedIn('/node/darshan-app/login'), async (req, res) => {
  try {
    const results = await controller.getRawUploadedImages(req, res);
    res.render('raw-uploaded-images', { title: 'Daily Darshan Files Uploader', results });
    res.end();
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get('/uploads/compressed-raw-images/:file', (req, res) => {
  const options = {
    root: `${__basedir}/uploads/compressed`,
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
  res.render('upload-processed-images', { title: 'Daily Darshan Files Uploader' });
  res.end();
});


router.post('/upload-processed-images/process', uploadProcessed.array('processedDarshanPhotos', 30), async (req, res) => {
  const result = await controller.uploadProcessedImages(req, res);
  if (result) {
    res.render('uploadSuccessful', { title: 'Upload Processed Images', message: 'Uploaded!', req });
    res.end();
  }
  res.render('uploadSuccessful', { title: 'Upload Processed Images', message: 'Upload failed', req });
  res.end();
});

module.exports = router;
