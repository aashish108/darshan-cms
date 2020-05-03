const request = require('supertest');
const app = require('../src/app');

const expressAppRequest = request.agent(app);

describe('GET endpoints', () => {
  it('/darshan-app/login redirects correctly when login is true', (done) => {
    expressAppRequest
      .post('/darshan-app/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=Sov108')
      .send('password=Password')
      .expect((res) => {
        console.log('res.headers.location', res.headers.location);
        if (res.headers.location !== '/darshan-app/stage1/upload') {
          throw new Error('Login failed.');
        }
      })
      .end(done);
  });

  it('/darshan-app/login redirects correctly when login is false', (done) => {
    expressAppRequest
      .post('/darshan-app/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=Sov108')
      .send('password=Passwordddd')
      .expect((res) => {
        console.log('res.headers.location false', res.headers.location);
        if (res.headers.location !== '/darshan-app/login') {
          throw new Error('Login failed.');
        }
      })
      .end(done);
  });

  it('/darshan-app/stage1/upload responds with 200', (done) => {
    expressAppRequest
      .get('/darshan-app/stage1/upload')
      .expect(200, done);
  });

  it('/darshan-app/stage2/upload-processed-images responds with 200', (done) => {
    expressAppRequest
      .get('/darshan-app/stage2/upload-processed-images')
      .expect(200, done);
  });

  it('/darshan-app/stage3/twitter with 200', (done) => {
    expressAppRequest
      .get('/darshan-app/stage3/twitter')
      .expect(200, done);
  });
});
