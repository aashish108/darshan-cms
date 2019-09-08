const express = require('express');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;
const routes = require('./routes/routes');
// const httpsLocalhost = require("https-localhost")
const controller = require('./controllers/controller');

const app = express();
// const https = require('https');
// const pem = require('pem');
const port = 3000;

controller.init();

let trustProxy = false;
if (process.env.DYNO) {
  // Apps on heroku are behind a trusted proxy
  trustProxy = true;
}

passport.use(new Strategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackURL: 'http://127.0.0.1:3000/node/darshan-app/twitter-auth/step3',
  proxy: trustProxy,
}, (token, tokenSecret, profile, cb) => cb(null, profile)));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: {secure: false} }));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');

app.use('/css-framework', express.static('node_modules/bulma/css')); // redirect CSS bootstrap
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

app.use(express.static(__dirname + '/'));

app.set('views', './src/views/');

// TODO: remove PEM
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// var https = require('https')
// var pem = require('pem')

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }

//   app.use('/node/darshan-app', routes.router)

//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(443)
// })
// 
app.use('/node/darshan-app', routes.router);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;