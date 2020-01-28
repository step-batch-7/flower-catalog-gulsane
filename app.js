const fs = require("fs");
const { createTable } = require("./lib/utils.js");
const CONTENT_TYPES = require("./lib/mediaType.js");

const getStaticFolder = () => {
  const STATIC_FOLDER = `${__dirname}/public`;
  return STATIC_FOLDER;
};

const decodeValue = value => {
  let decodedValue = value.replace(/\+/g, " ");
  return decodeURIComponent(decodedValue);
};

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split("=");
  query[key] = decodeValue(value);
  return query;
};

const readParams = keyValueTextPairs =>
  keyValueTextPairs.split("&").reduce(pickupParams, {});

const savePost = function(body, comments) {
  console.log(body);
  const comment = readParams(body);
  comment.date = new Date().toJSON();
  comments.unshift(comment);
  fs.writeFileSync("./userComments.json", `${JSON.stringify(comments)}`);
};

const serveGuestBook = function(req, res) {
  let comments = fs.readFileSync("./userComments.json", "utf8");
  comments = JSON.parse(comments);
  if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      savePost(body, comments);
    });
    res.writeHead(303, { Location: `/guestBook.html` });
    res.end();
  } else {
    const commentTable = createTable(comments);
    let content = fs.readFileSync("./public/guestBook.html", "utf8");
    content = content.replace("__comments__", commentTable);
    res.write(content);
    res.end();
  }
};

const serveStaticFile = (url, res) => {
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  const path = `${getStaticFolder()}${url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
  }
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  res.write(content);
  res.end();
};

const findHandler = req => {
  if (req.method === "GET" && req.url === "/") {
    return (req, res) => serveStaticFile("/index.html", res);
  }
  if (req.url === "/guestBook.html") {
    return serveGuestBook;
  }
  if (req.method === "GET") {
    return (req, res) => serveStaticFile(req.url, res);
  }
  return () => new Response();
};

const handleRequest = function(req, res) {
  const handler = findHandler(req);
  return handler(req, res);
};

module.exports = { handleRequest };
