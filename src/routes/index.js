const { Router } = require('express');
const passport = require('passport');
// const request = require('request');
const router = Router();

router.get('/login',
  (req, res) => {
    res.render('login');
  });

// router.post('/login',
//   (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//       res.redirect('/node/darshan-app/stage1/upload');
//     })(req, res, next);
// });

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/node/darshan-app/login' }),
  (req, res) => {
    res.redirect('/node/darshan-app/stage1/upload');
  });

router.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });

const stage1 = require('./stage1');
const stage2 = require('./stage2');
const stage3 = require('./stage3');
const api = require('./api');

router.use('/stage1', stage1);
router.use('/stage2', stage2);
router.use('/stage3', stage3);
router.use('/api', api);

module.exports = {
  router,
};
