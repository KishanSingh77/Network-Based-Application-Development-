const Users = require("../models/user");
let userList;

getAllUsers = () => {
  return new Promise((resolve, reject) => {
    Users.find({})
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

//finds user by userId
getUser = userId => {
  return new Promise((resolve, reject) => {
    Users.find({ userId: userId })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

//finds user by email
getUserByEmail = email => {
  return new Promise((resolve, reject) => {
    Users.findOne({ email: email })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

module.exports = { getAllUsers, getUserByEmail, getUser };
