const UserProfile = require("./../models/userProfile");

//complete these functions
addItem = (userId, userItem) => {
  console.log("*****************User Profile ADD***************");

  return new Promise((resolve, reject) => {
    const userProfile = new UserProfile({ item: userItem, userId: userId });
    console.log("done making the new object");

    UserProfile.find(
      ({ "item.item.itemCode": userItem.item.itemCode }, { userId: userId })
    )
      .exec()
      .then(async doc => {
        console.log("about to save item");

        console.log(doc);

        console.log(doc.length);

        if (!doc.length < 1) {
          await userProfile.save();
          console.log("length less than 1");
          return resolve();
        } else {
           
          return resolve;
        }
      })
      .catch(err => {
        console.log(err);
        return reject;
      });
  });
};
//************************ITEM Delete*****************************
removeUserItem = (userId, itemCode) => {
  console.log("   delete item  ", itemCode);

  return new Promise((resolve, reject) => {
    UserProfile.deleteOne(
      ({ userId: userId }, { "item.item.itemCode": itemCode })
    )
      .exec()
      .then(success => {
        console.log("deleted");
        return resolve();
      })
      .catch(err => {
        console.log(err);
        return reject;
      });
  });
};
//"************************ITEM EXISTS*****************************"
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
//"************************addItemRating*****************************"

addItemRating = async (userId, itemCode, rating) => {
  await UserProfile.updateOne(
    ({ userId: userId }, { "item.item.itemCode": itemCode }),
    { $set: { "item.rating": rating } }
  )
    .exec()
    .catch(err => console.log(err));
};

//"************************addMadeIt*****************************"

addMadeIt = async (userId, itemCode, madeIt) => {
  await UserProfile.updateOne(
    ({ userId: userId }, { "item.item.itemCode": itemCode }),
    { $set: { "item.madeIt": madeIt } }
  )
    .exec()
    .catch(err => console.log(err));
};

//"************************GET ITEM  *****************************"
getUserItems = userId => {
  console.log(
    "//************************GET ITEM  *****************************"
  );
  console.log("getUserItems in userProfileDB");

  return new Promise((resolve, reject) => {
    UserProfile.find({ userId: userId })

      .then(data => {
        return resolve(data.map(x => (x = x.item)));
      })
      .catch(err => {
        return reject(err);
      });
  });
};
emptyProfile = () => {
  userItems = [];
};

module.exports = {
  addItem,
  removeUserItem,
  updateItem,
  addItemRating,
  addMadeIt,
  getUserItems,
  emptyProfile
};
