const { Router } = require('express');
const passport = require('passport');
const loggedIn = require('connect-ensure-login');
const controller = require('../controllers/controller');
const router = Router();

router.get('/login',
  (req, res) => {
    console.log('Redirecting to login');
    res.render('login');
  });

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

router.get('/admin', loggedIn.ensureLoggedIn('/node/darshan-app/login'), async (req, res) => {
  try {
    const results = await controller.getUsers();
    res.render('adminUsersAccess', { title: 'Daily Darshan Files Uploader', results });
    res.end();
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post('/admin/process', loggedIn.ensureLoggedIn('/node/darshan-app/login'), (req, res) => {
  try {
    const { username, newPassword, roles } = req.body;
    controller.updateUser(username, newPassword, roles, res);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post('/admin/process/add-new-user', loggedIn.ensureLoggedIn('/node/darshan-app/login'), (req, res) => {
  try {
    const { newUsername, newPassword, roles } = req.body;
    controller.addNewUser(newUsername, newPassword, roles, res);
  } catch (e) {
    res.status(500).json(e);
  }
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
