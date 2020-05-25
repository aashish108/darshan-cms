const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { Strategy } = require('passport-local');
const routes = require('./routes/index');
const controller = require('./controllers/controller');

const port = process.env.DARSHAN_CMS_PORT || 3000;

controller.init();

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  async (username, password, cb) => {
    try {
      const userFound = await controller.findUser(username);
      if (userFound) {
        const authUser = await controller.authUser(username, password);
        if (authUser) {
          return cb(null, authUser);
        }
      }
      // user not found
      return cb(null, false);
    } catch (e) {
      console.log(e);
      return cb(e);
    }
  },
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const userID = await controller.findUserByID(id);
    return cb(null, userID);
  } catch (e) {
    return cb(e);
  }
});

const app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// app.use(require('morgan')('combined'));
app.use(cors());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.set('view engine', 'pug');

app.use('/darshan-app/css-framework', express.static('node_modules/bulma/css')); // redirect CSS bootstrap
app.use('/darshan-app/bulma-calendar', express.static('node_modules/bulma-calendar/dist'));
app.use('/darshan-app/uploads', express.static('uploads'));
app.use('/darshan-cms/uploads', express.static('uploads'));
app.use('/darshan-app/public', express.static('public'));

app.use(express.static(`${__dirname}/`));

app.set('views', './src/views/');

app.use(passport.initialize());
app.use(passport.session());

app.use('/darshan-app', routes.router);

app.get('*', (req, res, next) => {
  const error = new Error('Page Not Found');
  error.statusCode = 404;
  error.shouldRedirect = true;
  next(error);
});

// error handler middleware
app.use((err, req, res, next) => {
  console.log('Original URL:', req.originalUrl);
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;

  if (err.shouldRedirect) {
    res.render('error', {
      errorCode: err.statusCode,
      errorMessage: err.message,
    });
  } else {
    // If shouldRedirect is not defined in our error, sends our original err data
    res.status(err.statusCode).send(err.message);
  }
});

if (process.env.ENV === 'dev') {
  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
  }, app)
    .listen(port, () => {
      console.log(`Example app listening on port ${port}! Go to https://localhost:3000/`);
    });
} else {
  app.listen(port, () => console.log(`Darshan-cms app listening on port ${port}.`));
}

module.exports = app;
