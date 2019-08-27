var fs = require("fs");

/*fs.mkdir("stuff", () => {
  fs.readFile("readMe.txt", "utf8", (err, data) => {
    fs.writeFile("./stuff/writeMe.txt", data, () => {
      console.log("written to writeMe ");
    });
  });
});*/

fs.unlink("./stuff/writeMe.txt", function() {
  fs.rmdir("stuff", () => {
    console.log("deleted directory");
  });
});
