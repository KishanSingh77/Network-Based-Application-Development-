const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("This is HOME!!!!!");
});
app.get("/contact", (req, res) => {
  res.send("This is Contact Page!");
});
app.get("/profile/:name", (req, res) => {
  res.send("This is the profile with the name " + req.params.name);
});
app.listen(3000, () => {
  console.log("Server running 3000");
});
