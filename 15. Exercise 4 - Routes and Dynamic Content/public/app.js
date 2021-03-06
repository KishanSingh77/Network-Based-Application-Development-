const express = require("express");
const app = express();
const studentInfoRoute = require("./routes/studentInfo");
const indexRoute = require("./routes/index");

const port = "127.0.0.1";
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));
app.get("/", (req, res) => {
  res.send("<h1>This is home</h1>");
});
app.use("/studentInfo", studentInfoRoute);
app.use("/*", indexRoute);

app.listen(8080, port, () => {
  console.log("Server running");
});
