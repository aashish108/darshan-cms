const { assert } = require('chai');
const proxyquire = require('proxyquire');

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
    req.body.outfitDetails = 'Outfit 1';

    const res = {};
    res.end = () => true;
    res.render = () => true;

    const test = controller.uploadRawImages(req, res);

    if (test) {
      done();
    }
    assert.fail('Uploading raw images failed.');
  });
});
