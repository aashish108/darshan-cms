const express = require('express');
const routes = require('./routes/routes');
const httpsLocalhost = require("https-localhost")
const controller = require('./controllers/controller');

const app = express()
var https = require('https')
var pem = require('pem')
const port = 3000

controller.init();

app.set('view engine', 'pug')

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