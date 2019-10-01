const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/twitter', async (req, res) => {
  const latestDarshanImages = await controller.getProcessedUploadedImages(req, res);
  res.render('latest-darshan-images', { title: 'Daily Darshan Files Uploader', latestDarshanImages });
  res.end();
});

router.post('/twitter/upload', (req, res) => {
  controller.uploadToTwitter(req, res);
});

module.exports = router;
