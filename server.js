global.__basedir = __dirname;
require('dotenv').config();
const app = require('./src/app').default;
