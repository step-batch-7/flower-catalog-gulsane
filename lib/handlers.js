const fs = require('fs');
const { serveGuestBook, serveStaticFile, postComment } = require('../app');

const homePage = function(req, res) {
  const content = fs.readFileSync('./public/index.html');
  res.setHeader('Content-Type', 'text/html');
  res.end(content);
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

const postHandlers = {
  '/guestBook.html': postComment,
  defaultHandler: notFound
};

const getHandlers = {
  '/': homePage,
  '/guestBook.html': serveGuestBook,
  defaultHandler: serveStaticFile
};

const methods = {
  GET: getHandlers,
  POST: postHandlers,
  NOT_ALLOWED: { defaultHandler: methodNotAllowed }
};

module.exports = { methods };
