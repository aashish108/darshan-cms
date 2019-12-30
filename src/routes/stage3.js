const { Router } = require('express');
const loggedIn = require('connect-ensure-login');
const controller = require('../controllers/controller');

const router = Router();

router.get('/twitter', loggedIn.ensureLoggedIn('/node/darshan-app/login'), async (req, res) => {
  try {
    const latestDarshanImages = await controller.getLatestProcessedUploads(req, res);
    res.render('upload-to-twitter', {
      title: 'Daily Darshan Files Uploader', latestDarshanImages, user: req.user.username, roles: req.user.roles,
    });
    res.end();
  } catch (e) {
    res.status(500).json(e);
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

router.get('/facebook', loggedIn.ensureLoggedIn('/node/darshan-app/login'), async (req, res) => {
  try {
    const latestDarshanImages = await controller.getLatestProcessedUploads(req, res);
    res.render('upload-to-facebook', {
      title: 'Daily Darshan Files Uploader', latestDarshanImages, user: req.user.username, roles: req.user.roles,
    });
    res.end();
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post('/facebook/upload', (req, res) => {
  try {
    controller.uploadToFacebook(req, res);
  } catch (e) {
    res.status(500).json(e);
    res.end();
  }
});

router.get('/facebook/upload/confirmation', (req, res) => {
  try {
    res.render('upload-to-facebook-confirmation', {
      title: 'Facebook post Successful',
      message: 'Latest darshan has been posted on Facebook',
      roles: this.req.user.roles,
    });
    this.res.end();
  } catch (e) {
    res.status(500).json(e);
    res.end();
  }
});

module.exports = router;
