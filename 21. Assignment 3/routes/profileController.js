const express = require("express");
const router = express.Router();
const { categories } = require("../utility/categories");
const Item = require("../models/item");
const User = require("../models/user");
const { getItems } = require("../utility/itemDB");
const { UserItem } = require("../models/userItem");
var dialog = require("dialog");
//const { getUsers } = require("../utility/userDB");

router.use("/assets", express.static("assets"));

router.get("/", (req, res) => {
  console.log("index");
  console.log(req.session.theUser);
  res.render("index", { user: req.session.theUser });
});

router.get("/signIn", (req, res) => {
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
  const UserProfile = require("../models/userProfile");
  req.session.userProfile = UserProfile.getItems();
  res.render("myItems", { user: req.session.theUser, output: output });
});

router.get("/signOut", (req, res) => {
  console.log("signOut");
  req.session.theUser = null;
  req.session.userProfile = [];

  dialog.info("Sign In !", "Home");
  res.render("index", { user: null });
});

router.post("/myItems", (req, res) => {
  console.log("in my items");
  const UserProfile = require("../models/userProfile");

  //action parameter SAVE
  if (req.body.action === "save") {
    console.log("save");

    if (req.session.theUser === null || req.session.theUser == undefined) {
      dialog.info("Cannot Save without logging In", "UnAuthorized Activity");
      return res.render("categories", {
        user: req.session.theUser,
        itemList: getItems(),
        categories: categories
      });
    }

    //next we'll check if the item about to be updated is present in the itemList, this promotes security
    let itemExists = false;
    for (let i = 0; i < req.body.itemList.length; i++) {
      if (req.body.itemList[i] == req.body.itemCode) {
        itemExists = true;
        console.log("item exists");
      }
    }
    if (itemExists) {
      //so here we know item was missing in the list,therefore take back to myItems page, no Updates
      dialog.info("Items  Already exists in list", "Duplicate Item");
      return res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });
    }

    let item = getItem(req.body.itemCode);
    item = new UserItem(item, 0, false);

    UserProfile.addItem(item);
    let output = UserProfile.getItems();
    req.session.userProfile = UserProfile.getItems();

    res.render("myItems", {
      user: req.session.theUser,
      output: req.session.userProfile
    });
    //action parameter DELETE
  } else if (req.body.action === "deleteItem") {
    console.log("IN DELETE");

    UserProfile.removeItem(req.body.itemCode);
    let output = UserProfile.getItems();
    req.session.userProfile = UserProfile.getItems();

    res.render("myItems", {
      user: req.session.theUser,
      output: req.session.userProfile
    });
  } //action parameter UPDATE-PROFILE
  else if (req.body.action === "updateProfile") {
    console.log("in update ");
    console.log(req.body);

    //next we'll check if the item about to be updated is present in the itemList, this promotes security
    let itemExists = false;
    for (let i = 0; i < req.body.itemList.length; i++) {
      if (req.body.itemList[i] == req.body.itemCode) {
        itemExists = true;
        console.log("item exists");
      }
    }
    if (!itemExists) {
      //so here we know item was missing in the list,therefore take back to myItems page, no Updates
      dialog.info("Failed to Update", "UnAuthorized Activity Detected");
      return res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });
    }
    item = getItem(req.body.itemCode);
    itemModel = new Item(
      item.itemCode,
      item.itemName,
      item.catalogCategory,
      item.Description,
      item.rating,
      item.getImageURL
    );
    req.session.userProfile = UserProfile.getItems();
    res.render("feedback", {
      user: req.session.theUser,
      item: itemModel,
      rating: UserProfile.getItems().filter(
        x => x.item.itemCode == req.body.itemCode
      )[0].rating,

      madeIt: UserProfile.getItems().filter(
        x => x.item.itemCode == req.body.itemCode
      )[0].madeIt,
      output: req.session.userProfile
    });
  }
  //action parameter UPDATE-RATING
  else if (req.body.action == "updateRating") {
    console.log("in updateRating");

    //next we'll check if the item about to be updated is present in the itemList, this promotes security
    let itemExists = false;
    for (let i = 0; i < req.body.itemList.length; i++) {
      if (req.body.itemList[i] == req.body.itemCode) {
        itemExists = true;
        console.log("item exists");
      }
    }
    if (!itemExists) {
      //so here we know item was missing in the list,therefore take back to myItems page, no Updates
      dialog.info("Failed to Update", "UnAuthorized Activity Detected");
      return res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });
    }

    console.log("checkbox ==> " + req.body.madeIt);
    console.log("updatedRating==> " + req.body.updatedRating);
    console.log(
      "rating changed but " +
        UserProfile.getItems().filter(
          x => x.item.itemCode == req.body.itemCode
        )[0].madeIt
    );

    UserProfile.updateItem(
      req.body.itemCode,
      req.body.updatedRating,
      UserProfile.getItems().filter(
        x => x.item.itemCode == req.body.itemCode
      )[0].madeIt
    );
    req.session.userProfile = UserProfile.getItems();

    res.render("myItems", {
      user: req.session.theUser,
      output: req.session.userProfile
    });
  }
  //Action paramter UPDATE-FLAG
  else if (req.body.action == "updateFlag") {
    console.log("in updateFlag");
    console.log("checkbox ==> " + req.body.madeIt);
    console.log("updatedRating==> " + req.body.updatedRating);

    //next we'll check if the item about to be updated is present in the itemList, this promotes security
    let itemExists = false;
    for (let i = 0; i < req.body.itemList.length; i++) {
      if (req.body.itemList[i] == req.body.itemCode) {
        itemExists = true;
        console.log("item exists");
      }
    }
    if (!itemExists) {
      //so here we know item was missing in the list,therefore take back to myItems page, no Updates
      dialog.info("Failed to Update", "UnAuthorized Activity Detected");
      return res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });
    }

    UserProfile.updateItem(
      req.body.itemCode,
      UserProfile.getItems().filter(
        x => x.item.itemCode == req.body.itemCode
      )[0].rating,
      req.body.madeIt == "on"
    );
    req.session.userProfile = UserProfile.getItems();

    res.render("myItems", {
      user: req.session.theUser,
      output: req.session.userProfile
    });
  }
});

module.exports = router;
