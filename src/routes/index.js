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
  passport.authenticate('local', { failureRedirect: '/darshan-app/login' }),
  (req, res) => {
    res.redirect('/darshan-app/stage1/upload');
  });

router.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });

router.get('/admin', loggedIn.ensureLoggedIn('/darshan-app/login'), async (req, res, next) => {
  try {
    const results = await controller.getUsers();
    res.render('adminUsersAccess', { title: 'Daily Darshan Files Uploader', results });
  } catch (e) {
    const error = new Error(e);
    error.statusCode = 500;
    error.shouldRedirect = true;
    next(error);
  }
});

router.post('/admin/process', loggedIn.ensureLoggedIn('/darshan-app/login'), (req, res, next) => {
  try {
    const { username, newPassword, roles } = req.body;
    controller.updateUser(username, newPassword, roles, res);
  } catch (e) {
    const error = new Error(e);
    error.statusCode = 500;
    error.shouldRedirect = true;
    next(error);
  }
});

router.post('/admin/process/add-new-user', loggedIn.ensureLoggedIn('/darshan-app/login'), (req, res, next) => {
  try {
    const { newUsername, newPassword, roles } = req.body;
    controller.addNewUser(newUsername, newPassword, roles, res);
  } catch (e) {
    const error = new Error(e);
    error.statusCode = 500;
    error.shouldRedirect = true;
    next(error);
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
