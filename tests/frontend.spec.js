const request = require('supertest');
const express = require('express');
const app = require('../src/app');
const expressAppRequest = request(app);

describe('GET endpoints', function() {

  it('/node/darshan-app/upload responds with 200', function(done) {
    expressAppRequest
      .get('/node/darshan-app/upload')
      .expect(200, done);
  });

  it('/node/darshan-app/upload-processed-images responds with 200', function(done) {
    expressAppRequest
      .get('/node/darshan-app/upload-processed-images')
      .expect(200, done);
  });

});