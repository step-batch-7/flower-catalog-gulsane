const { Server } = require("http");
const { methods } = require("./lib/handlers.js");

const handleConnection = function(req, res) {
  console.log(req.url, req.method);
  const handlers = methods[req.method] || methods.NOT_ALLOWED;
  const handler = handlers[req.url] || handlers.defaultHandler;
  return handler(req, res);
};

const main = (port = 4000) => {
  const server = new Server(handleConnection);
  server.on("listening", () =>
    console.warn("server started listening", server.address())
  );
  server.listen(port);
};

main(process.argv[2]);
