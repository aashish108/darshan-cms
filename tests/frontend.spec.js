const request = require('supertest');
const app = require('../src/app');

const expressAppRequest = request(app);

describe('GET endpoints', () => {
  it('/node/darshan-app/stage1/upload responds with 200', (done) => {
    expressAppRequest
      .get('/node/darshan-app/stage1/upload')
      .expect(200, done);
  });

  it('/node/darshan-app/stage2/upload-processed-images responds with 200', (done) => {
    expressAppRequest
      .get('/node/darshan-app/stage2/upload-processed-images')
      .expect(200, done);
  });
});
