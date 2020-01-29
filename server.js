const { Server } = require('http');
const { methods } = require('./lib/handlers.js');
const port = process.argv[2] || 4000;

const handleConnection = function(req, res) {
  const handlers = methods[req.method] || methods.NOT_ALLOWED;
  const handler = handlers[req.url] || handlers.defaultHandler;
  return handler(req, res);
};

const main = port => {
  const server = new Server(handleConnection);
  server.listen(port);
};

main(port);
