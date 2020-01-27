const { Server } = require("net");
const fs = require("fs");
const Request = require("./lib/request.js");
const Response = require("./lib/response.js");
const {
  getResponseObject,
  formatComment,
  createTable
} = require("./lib/utils.js");
const CONTENT_TYPES = require("./lib/mediaType.js");

const getStaticFolder = extension => {
  const STATIC_FOLDER = `${__dirname}/public/${extension}`;
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
  let content = fs.readFileSync("./public/html/guestBook.html", "utf8");
  content = content.replace("__comments__", commentTable);
  return getResponseObject(content, "text/html");
};

const serveStaticFile = url => {
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  const path = `${getStaticFolder(extension)}${url}`;
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

const handleConnection = function(socket) {
  const remote = `${socket.remoteAddress}:${socket.remotePort}`;
  console.warn("new connection", remote);
  socket.setEncoding("utf8");
  socket.on("end", () => console.warn(`${remote} ended`));
  socket.on("error", err => console.warn("socket error", err));
  socket.on("data", text => {
    console.warn(`${remote} data:\n`);
    const req = Request.parse(text);
    const handler = findHandler(req);
    const res = handler(req);
    res.writeTo(socket);
  });
};

const main = (port = 4000) => {
  const server = new Server();
  server.on("error", err => console.warn("server error", err));
  server.on("listening", () =>
    console.warn("server started listening", server.address())
  );
  server.on("connection", handleConnection);
  server.listen(port);
};

main(process.argv[2]);
