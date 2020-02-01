const request = require('supertest');
const { app } = require('../lib/handlers.js');

describe('GET', () => {
  it('should return the home page when url is /', done => {
    request(app.serve.bind(app))
      .get('/')
      .set('accept', '*/*')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1368', done);
  });
  it('should return the static file when url /<any present file>', done => {
    request(app.serve.bind(app))
      .get('/index.html')
      .set('accept', '*/*')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1368', done);
  });
  it('should return the static files when url is /<any present file>', done => {
    request(app.serve.bind(app))
      .get('/abeliophyllum.html')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1716', done);
  });
  it('should return the static files when url is /<any present file>', done => {
    request(app.serve.bind(app))
      .get('/agerantum.html')
      .set('accept', '*/*')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1435', done);
  });
  it('should return the static files when url is <validFile>/badFile', done => {
    request(app.serve.bind(app))
      .get('/agerantum.html/badFile')
      .set('accept', '*/*')
      .expect(404, done);
  });
  it('should return the static file when url is /<any present file>', done => {
    request(app.serve.bind(app))
      .get('/guestBook.html')
      .set('accept', '*/*')
      .expect(200)
      .expect(/submit/)
      .expect('content-type', 'text/html', done);
  });
  it('should return the error code 403 when page is not available', done => {
    request(app.serve.bind(app))
      .get('/badFile')
      .set('accept', '*/*')
      .expect(404, done);
  });
});

describe('POST', () => {
  it('should return status code 404 if file is not present', done => {
    request(app.serve.bind(app))
      .post('/badFile')
      .set('accept', '*/*')
      .expect(400, done);
  });
  it('should post the comment', done => {
    request(app.serve.bind(app))
      .post('/comment')
      .send('name=gulshan&commentMsg=hello')
      .set('accept', '*/*')
      .expect(303)
      .expect('location', '/guestBook.html', done);
  });
});

describe('ANY METHOD OTHER THAN GET AND POST', () => {
  it('should return the that method is not allowed', done => {
    request(app.serve.bind(app))
      .put('/badFile.html')
      .expect(400, done);
  });
});
