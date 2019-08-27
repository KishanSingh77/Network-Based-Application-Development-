const express = require("express");
const app = express();
const catalogRouter = require("./routes/catalogController");
const profileRouter = require("./routes/profileController");

const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./models/user");

const mongoose = require("mongoose");
const {
  addItem,
  removeItem,
  updateItem,
  getUserItems,
  emptyProfile
} = require("./utility/userProfileDB");
//App starts

app.use(session({ secret: "Shh, its a secret!" }));
//app.use(session) must be done before using the bodyParser.json
// or else the session stays limited to one controller only

//Mongoose connection
mongoose.connect("mongodb://localhost:27017/shopping", {
  useNewUrlParser: true
});
let connection = mongoose.connection;
connection.on("connected", () => {
  console.log("****connected to shopping Db****");
});

connection.on("disconnected", () => {
  console.log("disconnected to Db");
});

connection.on("error", () => {
  console.log("******ERROR in connection**********");
});
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/profile", profileRouter);
app.get("/", (req, res) => {
  res.render("index", { user: req.session.theUser });
});

app.use("/", catalogRouter);

app.get("/about", (req, res) => {
  res.render("about", { user: req.session.theUser });
});
app.get("/contact", (req, res) => {
  res.render("contact", { user: req.session.theUser });
});

app.get("/signIn", async (req, res) => {
  console.log("in sign in");
  const UserProfile = require("./models/userProfile");

  getAllUsers()
    .then(user => {
      req.session.theUser = new User({
        userId: user[0].userId,
        password: user[0].password,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        address: user[0].address,
        city: user[0].city,
        state: user[0].state,
        zipCode: user[0].zipCode,
        country: user[0].country
      });
    })
    .then(async success => {
      output = await getUserItems(req.session.theUser.userId);
      res.render("myItems", { user: req.session.theUser, output: output });
    })
    .catch(err => console.log(err));

  //-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
});

app.listen(8080, "127.0.0.1", () => {
  "Server running on 8080";
});

module.exports = app;
