const { assert } = require('chai');
const moment = require('moment');
const controller = require('../src/controllers/controller.js');
const db = require('./helpers/db');


describe('API testing', () => {
  it('getTwoLatestProcessedUploads', async () => {
    const req = {};
    const res = {};
    res.end = () => true;
    res.render = () => true;
    req.files = ['test1.jpg'];
    req.body = {};
    req.body.outfitDetails = 'Outfit test 2';
    req.body.darshanDate = moment().format();
    req.body.fbPageToken = 'token';

    await controller.uploadProcessedImages(req, res);

    const results = await controller.getTwoLatestProcessedUploads(req, res);
    return assert.equal(results.length, 2, 'There are 2 objects in the results from the DB.');
  });
});
