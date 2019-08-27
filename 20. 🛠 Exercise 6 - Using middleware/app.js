const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "keyboard cat"
  })
);
app.set("view engine", "ejs");

app.use("/resources", express.static("resources"));

var studentInfo = require("./controls/studentInfo.js");
var index = require("./controls/index.js");
app.use("/", index);

app.use("/studentInfo", studentInfo);

app.listen(8080, "127.0.0.1");
