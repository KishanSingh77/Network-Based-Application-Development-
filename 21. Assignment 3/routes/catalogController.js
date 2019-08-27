const express = require("express");
const router = express.Router();

const { getItems, getItem } = require("../utility/itemDB");
const { categories } = require("../utility/categories");
const Item = require("../models/item");
const session = require("express-session");
//router.use(session({ secret: "Shh, its a secret!" }));
const getUsers = require("../utility/userDB");
var dialog = require("dialog");
let itemModel;

router.use("/assets", express.static("assets"));

router.get("/", (req, res) => {
  res.render("index", { user: req.session.theUser });
});

router.get("/categories", (req, res) => {
  console.log("in categories route");
  console.log(req.session.theUser);

  res.render("categories", {
    user: req.session.theUser,
    itemList: getItems(),
    categories: categories
  });
});

router.get("/categories/item/:itemID", (req, res) => {
  item = getItem(req.params.itemID);
  if (item === undefined) res.redirect("/categories"); //check for invalid item
  itemModel = new Item(
    item.itemCode,
    item.itemName,
    item.catalogCategory,
    item.Description,
    item.rating,
    item.getImageURL
  );
  console.log(" in item page");
  const UserProfile = require("../models/userProfile");
  req.session.userProfile = UserProfile.getItems();
  console.log(req.session.userProfile);

  res.render("item", {
    item: itemModel,
    user: req.session.theUser,
    output: req.session.userProfile
  });
});

router.get("/categories/feedback/:itemID", (req, res) => {
  const UserProfile = require("../models/userProfile");
  if (
    UserProfile.getItems().filter(
      x => x.item.itemCode == req.params.itemID
    )[0] == undefined
  ) {
    dialog.info(
      "Cannot rate without adding the item to saved List,you can only maintain a savedList if you're signed In",
      "UnAuthorized"
    );
    res.render("categories", {
      user: req.session.theUser,
      itemList: getItems(),
      categories: categories
    });
  }

  item = getItem(req.params.itemID);
  itemModel = new Item(
    item.itemCode,
    item.itemName,
    item.catalogCategory,
    item.Description,
    item.rating,
    item.getImageURL
  );

  console.log(UserProfile.getItems());

  res.render("feedback", {
    item: itemModel,
    user: req.session.theUser,
    rating: UserProfile.getItems().filter(
      x => x.item.itemCode == req.params.itemID
    )[0].rating,

    madeIt: UserProfile.getItems().filter(
      x => x.item.itemCode == req.params.itemID
    )[0].madeIt
  });
});
module.exports = router;
