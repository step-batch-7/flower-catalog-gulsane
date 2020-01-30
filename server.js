const { Server } = require('http');
const { app } = require('./lib/handlers.js');
const port = process.argv[2] || 4000;

const main = port => {
  const server = new Server(app.serve.bind(app));
  server.listen(port);
};

main(port);
