const http = require("http");
const fs = require("fs");

const server = http.createServer(function(req, res) {
  fs.readFile("./public/views/viewTextInBrowser.txt", "utf-8", (err, data) => {
    console.log(data);
    res.end(data);
  });
});

server.listen(8080, "127.0.0.1");
console.log("running on port 3000");
