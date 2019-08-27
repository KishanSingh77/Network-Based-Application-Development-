const Items = require("../models/item");

getImageURL = getImageURL => {
  return "/assets/Images/" + getImageURL;
};

getImageURL();

getItem = function(itemID) {
  return new Promise((resolve, reject) => {
    console.log(`finding item by ${itemID}`);

    Items.find({ itemCode: itemID })
      .then(data => {
        data.map(x => (x.getImageURL = getImageURL(x.getImageURL)));
        resolve(data[0]);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

getItems = function() {
  return new Promise((resolve, reject) => {
    Items.find({})
      .then(items => {
        items.map(x => (x.getImageURL = getImageURL(x.getImageURL)));
        resolve(items);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

module.exports = { getItem, getItems };
