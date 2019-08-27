const { getItem } = require("../utility/itemDB");
const { UserItem } = require("./userItem");
const dialog = require("dialog");

let userItems = [];

module.exports.userProfile = userId => {
  let userProfileModel = {
    userItems: [UserItem],
    userId: userId,
    addItem: addItem,
    removeItem: removeItem,
    updateItem: updateItem,
    getItems: getItems
  };
  return userProfileModel;
};

//complete these functions
addItem = UserItem => {
  console.log("*****************addItem***************");

  let flag = 0;
  for (let i = 0; i < userItems.length; i++) {
    if (userItems[i].item.itemCode === UserItem.item.itemCode) {
      console.log(
        "************************ITEM EXISTS*****************************"
      );
      dialog.info("Item is already in saved List", "Duplicate");
      flag = 1;
      break;
    }
  }
  if (flag == 0) {
    userItems.push(UserItem);
  }
};

removeItem = itemCode => {
  console.log("   delete item  ", itemCode);

  for (let i = 0; i < userItems.length; i++) {
    if (userItems[i].item.itemCode == itemCode) {
      userItems.splice(i, 1);
      break;
    }
  }
};

updateItem = (itemCode, rating, madeIt) => {
  console.log("madeIt===> " + madeIt);
  console.log("itemCode==> " + itemCode);
  // removeItem(itemCode);
  // let item = getItem(itemCode);
  // item = new UserItem(item, rating, madeIt);
  // addItem(item);

  for (let i = 0; i < userItems.length; i++) {
    console.log("update Item userprofile");

    console.log("itemCode==> " + userItems[i].item.itemCode);

    if (userItems[i].item.itemCode == itemCode) {
      userItems[i].rating = rating;
      userItems[i].madeIt = madeIt;
    }
  }
};

getItems = () => {
  return userItems;
};
emptyProfile = () => {
  userItems = [];
};

module.exports = {
  addItem,
  removeItem,
  updateItem,
  getItems,
  emptyProfile
};
