const http = require("http");
const fs = require("fs");
const path = require("path");
const server = http.createServer(function(req, res) {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("Hello Home!!");
    res.write(__dirname);
    res.end();
  } else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.join(__dirname, "/../views/about.html")).pipe(res);
  } else if (req.url === "/contact") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.join(__dirname, "/../views/contact.html")).pipe(
      res
    );
  }
});
server.listen(8080, () => {
  console.log("Server running on 8080");
});
