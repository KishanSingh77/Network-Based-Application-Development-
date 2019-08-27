const express = require("express");
const router = express.Router();
const { categories } = require("../utility/categories");
const Item = require("../models/item");
const User = require("../models/user");
const { getItems } = require("../utility/itemDB");
const { UserItem } = require("../models/userItem");
var dialog = require("dialog");
const { check, validationResult } = require("express-validator/check");
const { getAllUsers } = require("../utility/userDB");
const {
  addItem,
  removeUserItem,
  updateItem,
  addItemRating,
  addMadeIt,
  getUserItems,
  emptyProfile
} = require("./../utility/userProfileDB");

router.use("/assets", express.static("assets"));

router.get("/", (req, res) => {
  console.log("index");
  console.log(req.session.theUser);
  res.render("index", { user: req.session.theUser });
});

// router.get("/signIn", (req, res) => {
//   console.log(" in profile sign in");

//   req.session.theUser = new User({
//     userId: getAllUsers()[1].userId,
//     firstName: getAllUsers()[1].firstName,
//     lastName: getAllUsers()[1].lastName,
//     email: getAllUsers()[1].email,
//     address: getAllUsers()[1].address,
//     city: getAllUsers()[1].city,
//     state: getAllUsers()[1].state,
//     zipCode: getAllUsers()[1].zipCode,
//     country: getAllUsers()[1].country
//   });

//   //-----------------------------------------------------------------------------

//   //-----------------------------------------------------------------------------
//   const UserProfile = require("../models/userProfile");
//   req.session.userProfile = UserProfile.getItems();
//   res.render("myItems", { user: req.session.theUser, output: output });
// });

// **********************************SIGN-OUT**********************************
router.get("/signOut", (req, res) => {
  console.log("signOut");
  req.session.theUser = null;
  req.session.userProfile = [];

  dialog.info("Sign In !", "Home");
  res.render("index", { user: null });
});

// **********************************My ITEMS PAGE AFTER LOGIN**********************************

router.get("/myItems", async (req, res) => {
  console.log("traversing myItems after login via My orders");

  req.session.userProfile = await getUserItems(req.session.theUser.userId);

  return res.render("myItems", {
    user: req.session.theUser,
    output: req.session.userProfile
  });
});

//**************** *MY ITEMS  *******************
//**************** *MY ITEMS  *******************
//**************** *MY ITEMS  *******************
//**************** *MY ITEMS  *******************
//**************** *MY ITEMS  *******************

router.post(
  "/myItems",

  [
    check("action")
      .isAlpha()
      .withMessage("action must contain alphabets")
      .not()
      .isEmpty()
      .withMessage("action cannot be empty!")
  ],
  async (req, res) => {
    console.log("in my items");
    //print user login info
    console.log(req.session.theUser);

    //validation via express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array()[0].msg);
      return res.status(422).json({ errors: errors.array() });

      // return dialog.info(errors.array()[0].msg);
    }

    const UserProfile = require("../models/userProfile");

    //**************** */action parameter SAVE  *******************
    if (req.body.action === "save") {
      console.log(
        " //**************** */action parameter SAVE  *******************"
      );
      //checking if user session is maintained/ user is logged In
      if (req.session.theUser === null || req.session.theUser == undefined) {
        dialog.info("Cannot Save without logging In", "UnAuthorized Activity");
        getItems().then(itemList => {
          return res.render("categories", {
            user: req.session.theUser,
            itemList: itemList,
            categories: categories
          });
        });
      }

      //next we'll check if the item about to be updated is present in the itemList, this promotes security
      // req.body.itemList is obtained via http post method sent called from the forms with hidden fields
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
        req.session.userProfile = await getUserItems(
          req.session.theUser.userId
        );

        return res.render("myItems", {
          user: req.session.theUser,
          output: req.session.userProfile
        });
      }

      let item = await getItem(req.body.itemCode);

      await addItem(req.session.theUser.userId, new UserItem(item, 0, false));

      req.session.userProfile = await getUserItems(req.session.theUser.userId);

      res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });

      //**************** */action parameter DELETE  *******************
    } else if (req.body.action === "deleteItem") {
      console.log(
        " //**************** */action parameter DELETE  *******************"
      );

      await removeUserItem(req.session.theUser.userId, req.body.itemCode);

      req.session.userProfile = await getUserItems(req.session.theUser.userId);

      res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });
    }
    //**************** */action parameter UPDATE-PROFILE  *******************
    else if (req.body.action === "updateProfile") {
      console.log(
        " //**************** */action parameter UPDATE-PROFILE  ******************* "
      );

      //next we'll check if the item about to be updated is present in the itemList, this promotes security
      let itemExists = false;
      for (let i = 0; i < req.body.itemList.length; i++) {
        if (req.body.itemList[i] == req.body.itemCode) {
          itemExists = true;
          console.log("item exists, valid!");
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
      let item = await getItem(req.body.itemCode);

      let rating = await UserProfile.findOne({
        $and: [
          { userId: req.session.theUser.userId },
          { "item.item.itemCode": req.body.itemCode }
        ]
      })
        .exec()
        .then(doc => {
          return doc.item.rating;
        });

      let madeIt = await UserProfile.findOne({
        $and: [
          { userId: req.session.theUser.userId },
          { "item.item.itemCode": req.body.itemCode }
        ]
      })
        .exec()
        .then(doc => {
          return doc.item.madeIt;
        });

      req.session.userProfile = await getUserItems(req.session.theUser.userId);
      res.render("feedback", {
        user: req.session.theUser,
        item: item,

        rating: rating,

        madeIt: madeIt,
        output: req.session.userProfile
      });
    }

    //**************** */action parameter UPDATE-RATING  *******************
    else if (req.body.action == "updateRating") {
      console.log(
        "   //**************** */action parameter UPDATE-RATING  *******************"
      );
      //next we'll check if the item about to be updated is present in the itemList, this promotes security
      let itemExists = false;
      for (let i = 0; i < req.body.itemList.length; i++) {
        if (req.body.itemList[i] == req.body.itemCode) {
          itemExists = true;
          console.log("item exists");
        }
      }

      /* if (!itemExists) {
      //so here we know item was missing in the list,therefore take back to myItems page, no Updates
      dialog.info("Failed to Update", "UnAuthorized Activity Detected");
      return res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });
    }*/

      await addItemRating(
        req.session.theUser.userId,
        req.body.itemCode,
        req.body.updatedRating
      );
      req.session.userProfile = await getUserItems(req.session.theUser.userId);

      res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });
    }

    //**************** */action parameter UPDATE-FLAG  *******************
    else if (req.body.action == "updateFlag") {
      console.log(
        "//**************** */action parameter UPDATE-FLAG  *******************"
      );

      if (req.body.madeIt == "on") req.body.madeIt = true;
      else req.body.madeIt = false;

      //next we'll check if the item about to be updated is present in the itemList, this promotes security
      let itemExists = false;
      for (let i = 0; i < req.body.itemList.length; i++) {
        if (req.body.itemList[i] == req.body.itemCode) {
          itemExists = true;
          console.log("item exists");
        }
      } /*
    if (!itemExists) {
      //so here we know item was missing in the list,therefore take back to myItems page, no Updates
      dialog.info("Failed to Update", "UnAuthorized Activity Detected");
      return res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });
    }*/
      await addMadeIt(
        req.session.theUser.userId,
        req.body.itemCode,
        req.body.madeIt
      );
      req.session.userProfile = await getUserItems(req.session.theUser.userId);

      res.render("myItems", {
        user: req.session.theUser,
        output: req.session.userProfile
      });
    }
  }
);

module.exports = router;
