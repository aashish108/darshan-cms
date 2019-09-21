const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/twitter', (req, res) => {
  controller.getProcessedUploadedImages(req, res);
});

router.post('/twitter/upload', (req, res) => {
  controller.uploadToTwitter(req, res);
});

router.get('/twitter-auth/step3', (req, res) => {
  console.log('oauth_token', req.query.oauth_token);
  console.log('oauth_verifier', req.query.oauth_verifier);

  request.post({ url: 'https://api.twitter.com/oauth/access_token', form: { oauth_token: req.query.oauth_token, oauth_verifier: req.query.oauth_verifier } }, (e, httpResponse, body) => {
    console.log('e', e);
    console.log('body', body);
  });
});

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    res.json(req.user);
  });

module.exports = router;
