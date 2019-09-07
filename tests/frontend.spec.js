const request = require('supertest');
const express = require('express');
const app = require('../src/app');
const expressAppRequest = request(app);

describe('GET /node/darshan-app/upload', function() {
  it('responds with 200', function(done) {
    expressAppRequest
      .get('/node/darshan-app/upload')
      .expect(200, done);
  });
});