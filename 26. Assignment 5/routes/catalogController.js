const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const { getItems, getItem } = require("../utility/itemDB");
const { categories } = require("../utility/categories");
const Item = require("../models/item");
const session = require("express-session");
//router.use(session({ secret: "Shh, its a secret!" }));
const getUsers = require("../utility/userDB");
var dialog = require("dialog");
const {
  addItem,
  removeItem,
  updateItem,
  getUserItems,
  emptyProfile
} = require("./../utility/userProfileDB");
let itemModel;

router.use("/assets", express.static("assets"));

router.get("/", (req, res) => {
  res.render("index", { user: req.session.theUser });
});
// **********************************CATEGORIES**********************************
router.get("/categories", (req, res) => {
  console.log("in categories route");

  getItems().then(itemList => {
    res.render("categories", {
      user: req.session.theUser,
      itemList: itemList,
      categories: categories
    });
  });
});
// **********************************ITEM**********************************
router.get(
  "/categories/item/:itemID",
  [
    check("itemID")
      .isNumeric()
      .withMessage("invalid itemId, must be a number")
  ],
  async (req, res) => {
    console.log(" in item page");
    //validation via express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array()[0].msg);
      // return res.status(422).json({ errors: errors.array() });

      return dialog.info(errors.array()[0].msg);
    }

    const UserProfile = require("../models/userProfile");

    getItem(req.params.itemID).then(item => {
      if (item === undefined)
        //check for invalid item);
        return res.redirect("/categories");
      else {
        return res.render("item", {
          item: item,
          user: req.session.theUser,
          output: []
        });
      }
    });
  }
);

// **********************************FEEDBACK**********************************
router.get(
  "/categories/feedback/:itemID",
  [
    check("itemID")
      .isNumeric()
      .withMessage("invalid itemId, must be a number")
  ],
  async (req, res) => {
    console.log("in feedback");
    //validation via express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array()[0].msg);
      // return res.status(422).json({ errors: errors.array() });

      return dialog.info(errors.array()[0].msg);
    }
    const UserProfile = require("../models/userProfile");
    //check if user logged in

    if (req.session.theUser == null || undefined) {
      console.log("user not logged in");
      dialog.info("User not logged In", "Cannot Rate items without logging In");
      return res.render("categories", {
        user: undefined,
        itemList: await getItems(),
        categories: categories
      });
    }

    // we check if the item we're trying to rate is present in the userItem db
    // if yes => then we're allowed to rate
    //if no => we're unauthorized to rate it, better add it to the list

    await UserProfile.findOne({
      $and: [
        { userId: req.session.theUser.userId },
        { "item.item.itemCode": req.params.itemID }
      ]
    })
      .exec()
      .then(async doc => {
        console.log("in feedback check updates");

        if (!doc) {
          console.log("not doc");

          dialog.info(
            "=>Cannot rate without adding the item to saved List!! \\n ==>consider adding the item to your saved-List first!!",
            "UnAuthorized"
          );
          return res.render("categories", {
            user: req.session.theUser,
            itemList: await getItems(),
            categories: categories
          });
        }
      });
    console.log("outside doc check");

    item = await getItem(req.params.itemID);
    console.log(item);

    // taking rating from db to show the same on the feedback page
    let rating = await UserProfile.findOne({
      $and: [
        { userId: req.session.theUser.userId },
        { "item.item.itemCode": req.params.itemID }
      ]
    })
      .exec()
      .then(doc => {
        return doc.item.rating;
      });
    console.log(rating);

    // taking madeIt from db to show the same on the feedback page
    let madeIt = await UserProfile.findOne({
      $and: [
        { userId: req.session.theUser.userId },
        { "item.item.itemCode": req.params.itemID }
      ]
    })
      .exec()
      .then(doc => {
        return doc.item.madeIt;
      });
    console.log(madeIt);

    res.render("feedback", {
      item: item,
      user: req.session.theUser,
      rating: rating,

      madeIt: madeIt
    });
  }
);
module.exports = router;
