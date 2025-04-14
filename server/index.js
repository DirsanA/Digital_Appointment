const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const port = 4000;

server.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
