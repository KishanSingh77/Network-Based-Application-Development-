const Item = require("./item");

let UserItem = function(item, rating, madeIt) {
  let userItemModel = {
    item: item,
    rating: rating,
    madeIt: madeIt
  };

  return userItemModel;
};
module.exports = { UserItem };
