const express = require("express");
const app = express();
const catalogRouter = require("./routes/catalogController");
const profileRouter = require("./routes/profileController");
const { getUserByEmail } = require("./utility/userDB");
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./models/user");
const dialog = require("dialog");
//validation library
const { check, validationResult } = require("express-validator/check");

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
  console.log(req.session.user);
  if (req.session.user === undefined || null) {
    return res.render("login", { user: null });
  }
  // previous login functionality
  /*
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
*/

  //-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
});

app.post(
  "/signIn",
  [
    check("email")
      .isEmail()
      .withMessage("must be an email")
      .not()
      .isEmpty(),
    check("password")
      .isLength({ min: 5 })
      .withMessage("password must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("password must contain a number")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    console.log("log in attempt");

    //validation via express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array()[0].msg);
      // return res.status(422).json({ errors: errors.array() });

      return dialog.info(errors.array()[0].msg);
    }

    let user = await getUserByEmail(req.body.email);

    if (user.password === req.body.password) {
      console.log("equals");
      //put user in session
      req.session.theUser = new User({
        userId: user.userId,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country
      });

      console.log(req.session.theUser);

      output = await getUserItems(req.session.theUser.userId);
      return res.render("myItems", {
        user: req.session.theUser,
        output: output
      });
    } else {
      dialog.info("Incorrect Email or Password!", "Please try again!!!");
      res.redirect("/signIn");
    }
  }
);

app.listen(8080, "127.0.0.1", () => {
  "Server running on 8080";
});

module.exports = app;
