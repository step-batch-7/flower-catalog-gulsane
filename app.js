const fs = require("fs");
const { createTable, readParams } = require("./lib/utils.js");
const CONTENT_TYPES = require("./lib/mediaType.js");

const getStaticFolder = () => {
  const STATIC_FOLDER = `${__dirname}/public`;
  return STATIC_FOLDER;
};

const savePost = function(body, comments) {
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

const serveStaticFile = (req, res) => {
  const [, extension] = req.url.match(/.*\.(.*)$/) || [];
  const path = `${getStaticFolder()}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    res.writeHead(404, "Not Found");
    res.end();
    return;
  }
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  res.writeHead(200, { "content-type": contentType });
  res.write(content);
  res.end();
};

module.exports = { serveGuestBook, serveStaticFile };
