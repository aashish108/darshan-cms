const express = require('express');
const routes = require('./routes/routes');

const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use('/css-framework', express.static('node_modules/bulma/css')); // redirect CSS bootstrap
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

app.use(express.static(__dirname + '/'));
app.use('/node/darshan-app', routes.router)
app.set('views', './src/views/');

app.listen(port, () => console.log(`Example app listening on port ${port}!`))