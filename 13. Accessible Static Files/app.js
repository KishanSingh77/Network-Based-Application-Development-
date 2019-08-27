const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/profile/:name", (req, res) => {
  var data = {
    age: 29,
    job: "ninja",
    hobbies: ["eating", "fighting", "fishes"]
  };
  res.render("profile", { person: req.params.name, data: data });
});
app.listen(3000, () => {
  console.log("Server running 3000");
});
