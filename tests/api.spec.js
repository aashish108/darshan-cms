const { assert } = require('chai');
const moment = require('moment');
const proxyquire = require('proxyquire');

describe('API testing', () => {
  let controller;

  beforeEach(() => {
    const compressImagesStub = () => true;
    const slackStub = () => true;
    controller = proxyquire('../src/controllers/controller.js', {
      '../helpers/imageTools': {
        compressImages: compressImagesStub,
      },
      '../helpers/slack': {
        sendNotification: slackStub,
        '@noCallThru': true,
      },
    });
  });
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

    await controller.uploadProcessedImages(req.files, req.body);

    const results = await controller.getTwoLatestProcessedUploads(req, res);
    return assert.equal(results.length, 2, 'There are 2 objects in the results from the DB.');
  });
});
