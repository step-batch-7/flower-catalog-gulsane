const fs = require('fs');
const { createTable, readParams } = require('./lib/utils.js');
const CONTENT_TYPES = require('./lib/mediaType.js');

const getStaticFolder = () => {
  const STATIC_FOLDER = `${__dirname}/public`;
  return STATIC_FOLDER;
};

const savePost = function(body, comments) {
  const comment = readParams(body);
  comment.date = new Date().toJSON();
  comments.unshift(comment);
  fs.writeFileSync('./userComments.json', `${JSON.stringify(comments)}`);
};

const postComment = function(req, res) {
  let comments = fs.readFileSync('./userComments.json', 'utf8');
  comments = JSON.parse(comments);
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    savePost(body, comments);
  });
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

const respondError = function(res) {
  const statusCode = 404;
  res.writeHead(statusCode, 'Not Found');
  res.end();
};

const getExtension = url => {
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  return extension;
};

const respondContent = function(req, res, content) {
  const extension = getExtension(req.url);
  const statusCode = 200;
  res.writeHead(statusCode, { 'content-type': CONTENT_TYPES[extension] });
  res.write(content);
  res.end();
};

const serveStaticFile = function(req, res) {
  const path = `${getStaticFolder()}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    respondError(res);
    return;
  }
  const content = fs.readFileSync(path);
  respondContent(req, res, content);
};

module.exports = { serveGuestBook, serveStaticFile, postComment };
