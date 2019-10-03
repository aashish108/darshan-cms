const { assert } = require('chai');
const proxyquire = require('proxyquire');
const moment = require('moment');

describe('Controller unit testing', () => {
  let controller;

  beforeEach(() => {
    const compressImagesStub = () => true;
    controller = proxyquire('../src/controllers/controller.js', {
      '../helpers/imageTools': {
        compressImages: compressImagesStub,
      },
    });
  });

  it('uploadRawImages', (done) => {
    const req = {};
    req.files = ['test1.jpg'];
    req.body = {};
    req.body.outfitDetails = 'Outfit test 1';

    const res = {};
    res.end = () => true;
    res.render = () => true;

    const test = controller.uploadRawImages(req, res);

    if (test) {
      done();
    }
    assert.fail('Uploading raw images failed.');
  });

  it('getRawUploadedImages - data uploaded is saved in DB', async () => {
    const req = {};
    const res = {};
    res.end = () => true;
    res.render = () => true;
    const results = await controller.getRawUploadedImages(req, res);
    return assert.equal(results[1].outfitDetails, 'Outfit test 1', 'data is saved in DB and equates to what was aded in previous step.');
  });

  it('uploadProcessedImages', async () => {
    const req = {};
    req.files = ['test1.jpg'];
    req.body = {};
    req.body.outfitDetails = 'Outfit test 2';
    req.body.darshanDate = moment().format();
    req.body.fbPageToken = 'token';

    const res = {};
    res.end = () => true;
    res.render = () => true;
    console.log(await controller.uploadProcessedImages(req, res));
    return assert.isTrue(await controller.uploadProcessedImages(req, res), 'Adding uploaded and processed images to DB returned as a success.');
  });

  it('getProcessedUploadedImages - data uploaded is saved in DB', async () => {
    const req = {};
    const res = {};
    res.end = () => true;
    res.render = () => true;
    const results = await controller.getLatestProcessedUploads(req, res);
    return assert.equal(results.outfitDetails, 'Outfit test 2', 'data is saved in DB and equates to what was aded in previous step for uploading processed images.');
  });
});
