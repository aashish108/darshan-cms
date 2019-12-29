const { assert } = require('chai');
const proxyquire = require('proxyquire');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../src/app');

const expressAppRequest = request.agent(app);

describe('Twitter API testing', () => {
  let initFake;

  beforeEach(() => {
    initFake = sinon.fake();
    proxyquire('../src/controllers/controller.js', {
      '../helpers/twitterApi': {
        init: initFake,
      },
    });
  });

  it('uploadToTwitter is called', () => {
    expressAppRequest
      .post('/node/darshan-app/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=Sov108')
      .send('password=Password');
    expressAppRequest
      .post('/node/darshan-app/stage3/twitter/upload')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('files=file1.jpg')
      .send('outfitDetails=Outfit 2')
      .expect(() => {
        assert(initFake.called);
      });
  });
});
