var mongoose = require("mongoose");
var Schema = mongoose.Schema;

items = new Schema({
  itemCode: { type: String, required: true },
  itemName: { type: String, required: true },
  catalogCategory: { type: String, required: true },
  Description: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: String, required: true },
  getImageURL: { type: String, required: true }
});

module.exports = mongoose.model("Item", items);
