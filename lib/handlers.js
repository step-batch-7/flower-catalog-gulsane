const fs = require('fs');
const parseBody = require('querystring').parse;
const CONTENT_TYPES = require('./mediaType.js');
const { App } = require('./app.js');
const { Comment, Comments } = require('./comments.js');

const loadComments = () => {
  const comments = fs.readFileSync('./data/userComments.json', 'utf8');
  return JSON.parse(comments || '[]');
};

const comments = Comments.load(loadComments());
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
    return next();
  }
  const content = fs.readFileSync(absolutePath);
  const extension = getExtension(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(content);
};

const saveComment = function(req, res) {
  const comment = new Comment(req.body.name, req.body.commentMsg, new Date());
  comments.addComment(comment);
  fs.writeFileSync('./data/userComments.json', comments.toJSON());
  const statusCode = 303;
  res.writeHead(statusCode, { Location: '/guestBook.html' });
  res.end(JSON.stringify(req.body));
};

const serveGuestBook = function(req, res) {
  let content = fs.readFileSync('./public/guestBook.html', 'utf8');
  content = content.replace('__comments__', comments.toHTML());
  res.setHeader('content-type', 'text/html');
  res.setHeader('content-length', `${content.length}`);
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
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.body = parseBody(data);
    }
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
app.post('/comment', saveComment);
app.get('', notFound);
app.post('', methodNotAllowed);
app.use(methodNotAllowed);

module.exports = { app };
