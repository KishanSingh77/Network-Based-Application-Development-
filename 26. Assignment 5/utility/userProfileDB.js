const UserProfile = require("./../models/userProfile");

//complete these functions
addItem = (userId, userItem) => {
  console.log("*****************User Profile ADD***************");

  return new Promise(async (resolve, reject) => {
    const userProfile = new UserProfile({ item: userItem, userId: userId });
    console.log("done making the new object");

    await UserProfile.find({
      $and: [
        {
          "item.item.itemCode": userItem.item.itemCode
        },
        {
          userId: userId
        }
      ]
    })
      .exec()
      .then(async doc => {
        if (doc.length == 1) {
          return resolve();
        } else {
          await userProfile.save();
          return resolve();
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

  return new Promise(async (resolve, reject) => {
    await UserProfile.deleteOne({
      $and: [{ userId: userId }, { "item.item.itemCode": itemCode }]
    })
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
    { $and: [{ userId: userId }, { "item.item.itemCode": itemCode }] },
    { $set: { "item.rating": rating } }
  )
    .exec()
    .catch(err => console.log(err));
};

//"************************addMadeIt*****************************"

addMadeIt = async (userId, itemCode, madeIt) => {
  await UserProfile.updateOne(
    { $and: [{ userId: userId }, { "item.item.itemCode": itemCode }] },
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

  return new Promise(async (resolve, reject) => {
    await UserProfile.find({ userId: userId })

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
