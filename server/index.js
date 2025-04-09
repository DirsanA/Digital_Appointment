const app = require("./app");
const http = require("http");

const PORT = 5000;

const server = http.createServer(app);

server.listen(PORT, function () {
  console.log(`the server is listenning ${PORT} `);
});
