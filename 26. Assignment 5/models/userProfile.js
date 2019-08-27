const dialog = require("dialog");
const Item = require("./item");
const UserItem = require("./userItem");
const UserProfile = require("./userProfile");

//let userItems = [];

//*************************************************************** */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

userProfile = new Schema({
  item: { type: UserItem, required: true },
  userId: { type: String, required: true }
});

module.exports = mongoose.model("UserProfile", userProfile);

//************************************************************* */
