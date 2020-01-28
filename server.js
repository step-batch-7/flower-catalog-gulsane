const { Server } = require("http");
const { handleRequest } = require("./app.js");

const handleConnection = function(req, res) {
  console.log(req.url, req.method);
  handleRequest(req, res);
};

const main = (port = 4000) => {
  const server = new Server(handleConnection);
  server.on("listening", () =>
    console.warn("server started listening", server.address())
  );
  server.listen(port);
};

main(process.argv[2]);
