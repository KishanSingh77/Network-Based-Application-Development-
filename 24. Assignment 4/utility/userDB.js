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

module.exports = { getAllUsers };
