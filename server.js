const { Server } = require("net");
const fs = require("fs");
const Request = require("./lib/request.js");
const Response = require("./lib/response.js");

const getStaticFolder = extension => {
  const STATIC_FOLDER = `${__dirname}/public/${extension}`;
  return STATIC_FOLDER;
};
const CONTENT_TYPES = {
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
  gif: "image/gif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  pdf: "application/pdf"
};

const getResponseObject = function(content, contentType) {
  const res = new Response();
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", content.length);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const serveStaticFile = req => {
  const [, extension] = req.url.match(/.*\.(.*)$/) || [];
  const path = `${getStaticFolder(extension)}${req.url}`;
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
    req.url = "/index.html";
    return serveStaticFile;
  }

  if (req.method === "GET") {
    return serveStaticFile;
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
