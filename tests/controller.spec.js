const { assert } = require('chai');
const proxyquire = require('proxyquire');
const moment = require('moment');

describe('Controller unit testing', () => {
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

  it('uploadRawImages', async () => {
    const req = {};
    req.files = ['test1.jpg'];
    req.body = {};
    req.body.outfitDetails = 'Outfit test 1';
    req.body.roles = ['admin'];
    req.user = {};
    req.user.roles = true;

    const res = {};
    res.end = () => true;
    res.render = () => true;

    const test = await controller.uploadRawImages(req, res);
    await controller.addRawUploadsToDB(req.files[0], req.body.outfitDetails);
    assert.isNotNull(test, 'uploading images successful');
  });

  it('getRawUploadedImages - data uploaded is saved in DB', async () => {
    const req = {};
    const res = {};
    req.user = {};
    res.end = () => true;
    res.render = () => true;
    req.user.roles = true;
    const results = await controller.getRawUploadsFromDB();
    console.log('DB response 2: ', results);
    assert.equal(results[0].outfitDetails, 'Outfit test 1', 'data is saved in DB and equates to what was added in previous step.');
  });

  it('uploadProcessedImages', async () => {
    const req = {};
    req.files = ['test1.jpg'];
    req.body = {};
    req.body.outfitDetails = 'Outfit test 2';
    req.body.darshanDate = moment().format();
    req.body.roles = ['admin'];
    req.body.fbPageToken = 'token';
    req.user = {};
    req.user.roles = true;

    const res = {};
    res.end = () => true;
    res.render = () => true;
    const response = await controller.uploadProcessedImages(req.file, req.body);
    return assert.isNotNull(response._id, 'Adding uploaded and processed images to DB returned as a success.');
  });

  it('getProcessedUploadedImages - data uploaded is saved in DB', async function () {
    this.timeout(10000);
    const req = {};
    const res = {};
    req.user = {};
    res.end = () => true;
    res.render = () => true;
    req.user.roles = true;
    const results = await controller.getLatestProcessedUploadsFromDB(req, res);
    console.log('DB response: ', results);
    return assert.equal(results[0].outfitDetails, 'Outfit test 2', 'data is saved in DB and equates to what was aded in previous step for uploading processed images.');
  });
});
