const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/twitter', (req, res) => {
  controller.getProcessedUploadedImages(req, res);
});

router.post('/twitter/upload', (req, res) => {
  controller.uploadToTwitter(req, res);
});

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    res.json(req.user);
  });

module.exports = router;
