const fs = require("fs");
const Response = require("./lib/response.js");
const {
  getResponseObject,
  formatComment,
  createTable
} = require("./lib/utils.js");
const CONTENT_TYPES = require("./lib/mediaType.js");

const getStaticFolder = () => {
  const STATIC_FOLDER = `${__dirname}/public`;
  return STATIC_FOLDER;
};

const serveGuestBook = function(req) {
  let comments = fs.readFileSync("./userComments.json", "utf8");
  comments = JSON.parse(comments);
  if (req.method === "POST") {
    const comment = formatComment(req.body);
    comment.date = new Date().toJSON();
    comments.unshift(comment);
    fs.writeFileSync("./userComments.json", `${JSON.stringify(comments)}`);
  }
  const commentTable = createTable(comments);
  let content = fs.readFileSync("./public/guestBook.html", "utf8");
  content = content.replace("__comments__", commentTable);
  return getResponseObject(content, "text/html");
};

const serveStaticFile = url => {
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  const path = `${getStaticFolder()}${url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    return new Response();
  }
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  return getResponseObject(content, contentType);
};

const findHandler = req => {
  if (req.method === "GET" && req.url === "/") {
    return () => serveStaticFile("/index.html");
  }
  if (req.url === "/guestBook.html") {
    return serveGuestBook;
  }
  if (req.method === "GET") {
    return () => serveStaticFile(req.url);
  }
  return () => new Response();
};

const handleRequest = function(req) {
  const handler = findHandler(req);
  return handler(req);
};

module.exports = { handleRequest };
