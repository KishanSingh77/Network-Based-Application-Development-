const express = require("express");
const app = express();
const catalogRouter = require("./routes/catalogController");
const profileRouter = require("./routes/profileController");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
app.use(session({ secret: "Shh, its a secret!" }));
const User = require("./models/user");
var dialog = require("dialog");
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  next();
});
app.use("/profile", profileRouter);
app.get("/", (req, res) => {
  res.render("index", { user: req.session.theUser });
});

app.use("/", catalogRouter);

// myItems page, but now it is same as logging in

// app.get("/myItems", (req, res) => {
//   console.log("in my items");
//   const UserProfile = require("./models/userProfile");
//   output = UserProfile.getItems();

//   if (req.session.theUser === undefined || null) {
//     console.log("user " + req.session.theUser + "  displaying no items");

//     req.session.theUser = null;
//     req.session.UserProfile = [];
//     return res.render("myItems", {
//       user: req.session.theUser,
//       output: req.session.UserProfile
//     });
//   }
//   res.render("myItems", {
//     user: req.session.theUser,
//     output: req.session.userProfile
//   });
// });

app.get("/about", (req, res) => {
  res.render("about", { user: req.session.theUser });
});
app.get("/contact", (req, res) => {
  res.render("contact", { user: req.session.theUser });
});

app.get("/signIn", (req, res) => {
  req.session.theUser = new User(
    getUsers()[1].userId,
    getUsers()[1].firstName,
    getUsers()[1].lastName,
    getUsers()[1].email,
    getUsers()[1].address,
    getUsers()[1].city,
    getUsers()[1].state,
    getUsers()[1].zipCode,
    getUsers()[1].country,
    getUsers()[1].userId
  );

  //-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
  console.log(req.session.theUser.firstName);
  const UserProfile = require("./models/userProfile");
  output = UserProfile.getItems();
  res.render("myItems", { user: req.session.theUser, output: output });
});

app.listen(8080, "127.0.0.1", () => {
  "Server running on 8080";
});

module.exports = app;
