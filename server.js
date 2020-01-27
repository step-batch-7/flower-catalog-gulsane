const { Server } = require("net");
const Request = require("./lib/request.js");
const { handleRequest } = require("./app.js");

const handleConnection = function(socket) {
  const remote = `${socket.remoteAddress}:${socket.remotePort}`;
  console.warn("new connection", remote);
  socket.setEncoding("utf8");
  socket.on("end", () => console.warn(`${remote} ended`));
  socket.on("error", err => console.warn("socket error", err));
  socket.on("data", text => {
    console.warn(`${remote} data:\n`);
    const req = Request.parse(text);
    const res = handleRequest(req);
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
