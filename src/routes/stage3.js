const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/twitter', async (req, res) => {
  try {
    const latestDarshanImages = await controller.getLatestProcessedUploads(req, res);
    res.render('latest-darshan-images', { title: 'Daily Darshan Files Uploader', latestDarshanImages });
    res.end();
  } catch (e) {
    res.status(500).json(e);
    res.end();
  }
});

router.post('/twitter/upload', (req, res) => {
  try {
    controller.uploadToTwitter(req, res);
  } catch (e) {
    res.status(500).json(e);
    res.end();
  }
});

module.exports = router;
