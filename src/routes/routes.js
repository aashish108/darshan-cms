const express = require('express');
const multer = require('multer');
const controller = require('../controllers/controller');
const twitter = require('../helpers/twitterApi');
const passport = require('passport');
const request = require('request');
const router = express.Router();
const uploadRaw = multer({ dest: 'uploads/temp_raw_images' });
const uploadProcessed = multer({ dest: 'uploads/processed_images' });



router.get('/upload', (req, res) => {
  res.render('index', { title: 'Daily Darshan Files Uploader' });
  res.end();
});

router.post('/upload/process', uploadRaw.array('darshanPhotos', 30), (req, res) => {
  controller.uploadRawImages(req, res);
});

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
})

router.get('/upload-processed-images', (req, res) => {
  res.render('upload-processed-images', { title: 'Daily Darshan Files Uploader' });
  res.end();
});

router.post('/upload-processed-images/process', uploadProcessed.array('processedDarshanPhotos', 30), (req, res) => {
  controller.uploadProcessedImages(req, res);
});

router.get('/twitter-auth', passport.authenticate('twitter'));

router.get('/twitter-auth/step3asd',
  passport.authenticate('twitter', { failureRedirect: '/upload' }), (req, res) => {
    console.log('oauth_token', req.query.oauth_token);
    console.log('oauth_verifier', req.query.oauth_verifier);

      request.post({url:'https://api.twitter.com/oauth/access_token', form: {oauth_token: req.query.oauth_token, oauth_verifier: req.query.oauth_verifier}}, function(e,httpResponse,body){ 
      console.log('e', e);
      console.log('body', body);
  })

});

router.get('/twitter-auth/step3', (req, res) => {
    console.log('oauth_token', req.query.oauth_token);
    console.log('oauth_verifier', req.query.oauth_verifier);

      request.post({url:'https://api.twitter.com/oauth/access_token', form: {oauth_token: req.query.oauth_token, oauth_verifier: req.query.oauth_verifier}}, function(e,httpResponse,body){ 
      console.log('e', e);
      console.log('body', body);
  })

});

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.json(req.user);
  });

module.exports = {
  router,
};
