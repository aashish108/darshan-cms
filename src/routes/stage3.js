const { Router } = require('express');
const loggedIn = require('connect-ensure-login');
const controller = require('../controllers/controller');

const router = Router();

router.get('/twitter', loggedIn.ensureLoggedIn('/darshan-app/login'), async (req, res, next) => {
  try {
    const latestDarshanImages = await controller.getLatestProcessedUploadsFromDB();
    res.render('upload-to-twitter', {
      title: 'Daily Darshan Files Uploader',
      latestDarshanImages,
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

router.post('/twitter/upload', (req, res, next) => {
  try {
    controller.uploadToTwitter(req, res);
  } catch (e) {
    const error = new Error(e);
    error.statusCode = 500;
    error.shouldRedirect = true;
    next(error);
  }
});

router.get('/facebook', loggedIn.ensureLoggedIn('/darshan-app/login'), async (req, res, next) => {
  try {
    const latestDarshanImages = await controller.getLatestProcessedUploadsFromDB();
    res.render('upload-to-facebook', {
      title: 'Daily Darshan Files Uploader',
      latestDarshanImages,
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
router.post('/facebook/upload', async (req, res, next) => {
  try {
    const response = await controller.uploadToFacebook(req, res, next);
    // if (response) {
    //   const error = new Error();
    //   error.statusCode = 500;
    //   error.shouldRedirect = true;
    //   error.message = response;
    //   next(error);
    // }
  } catch (e) {
    const error = new Error(e);
    error.statusCode = 500;
    error.shouldRedirect = true;
    next(error);
  }
});

module.exports = router;
