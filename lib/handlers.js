const fs = require('fs');
const CONTENT_TYPES = require('./mediaType.js');
const { App } = require('./app.js');
const { createTable, readParams } = require('./utils.js');

const getExtension = url => {
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  return extension;
};

const getStaticFolder = () => {
  const STATIC_FOLDER = `${__dirname}/../public`;
  return STATIC_FOLDER;
};

const decidePath = function(url) {
  const path = url === '/' ? '/index.html' : url;
  return path;
};

const serveStaticFile = function(req, res, next) {
  const path = decidePath(req.url);
  const absolutePath = `${getStaticFolder()}` + path;
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  if (!stat || !stat.isFile()) {
    next();
    return;
  }
  const content = fs.readFileSync(absolutePath);
  const extension = getExtension(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(content);
};

const savePost = function(req, res) {
  let comments = fs.readFileSync('./userComments.json', 'utf8');
  comments = JSON.parse(comments);
  const comment = readParams(req.body);
  comment.date = new Date().toDateString();
  comments.unshift(comment);
  fs.writeFileSync('./userComments.json', `${JSON.stringify(comments)}`);
  const statusCode = 303;
  res.writeHead(statusCode, { Location: '/guestBook.html' });
  res.end();
};

const serveGuestBook = function(req, res) {
  let comments = fs.readFileSync('./userComments.json', 'utf8');
  comments = JSON.parse(comments);
  const commentTable = createTable(comments);
  let content = fs.readFileSync('./public/guestBook.html', 'utf8');
  content = content.replace('__comments__', commentTable);
  res.write(content);
  res.end();
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const notFound = function(req, res) {
  const statusCode = 404;
  res.writeHead(statusCode);
  res.end('Not Found');
};

const methodNotAllowed = function(req, res) {
  const statusCode = 400;
  res.writeHead(statusCode, 'Method Not Allowed');
  res.end();
};

const app = new App();

app.use(readBody);

app.get('/guestBook.html', serveGuestBook);
app.get('', serveStaticFile);
app.post('/guestBook.html', savePost);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
