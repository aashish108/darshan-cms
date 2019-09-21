const { Router } = require('express');
const multer = require('multer');
const controller = require('../controllers/controller');

const uploadProcessed = multer({ dest: 'uploads/processed_images' });
const router = Router();

router.get('/raw-uploaded-images', (req, res) => {
  controller.getRawUploadedImages(req, res);
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

router.get('/upload-processed-images', (req, res) => {
  res.render('upload-processed-images', { title: 'Daily Darshan Files Uploader' });
  res.end();
});


router.post('/upload-processed-images/process', uploadProcessed.array('processedDarshanPhotos', 30), (req, res) => {
  controller.uploadProcessedImages(req, res);
});

module.exports = router;
