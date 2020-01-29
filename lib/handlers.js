const fs = require("fs");
const { serveGuestBook, serveStaticFile } = require("../app");

const homePage = function(req, res) {
  const content = fs.readFileSync("./public/index.html");
  res.setHeader("Content-Type", "text/html");
  res.end(content);
};

const notFound = function(req, res) {
  res.writeHead(404);
  res.end("Not Found");
};

const methodNotAllowed = function(req, res) {
  res.writeHead(400, "Method Not Allowed");
  res.end();
};

const postHandlers = {
  "/guestBook.html": serveGuestBook,
  defaultHandler: notFound
};

const getHandlers = {
  "/": homePage,
  "/guestBook.html": serveGuestBook,
  defaultHandler: serveStaticFile
};

const methods = {
  GET: getHandlers,
  POST: postHandlers,
  NOT_ALLOWED: { defaultHandler: methodNotAllowed }
};

module.exports = { methods };
