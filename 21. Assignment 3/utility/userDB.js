let userList = [
  {
    userId: "1",
    firstName: "Kishan",
    lastName: "Singh",
    email: "ksingh15@uncc.edu",
    address: "742 Evergreen Terrace",
    city: "New York City",
    state: "New York ",
    zipCode: "10001",
    country: "United States of America"
  },
  {
    userId: "2",
    firstName: "Sherlock",
    lastName: "Singh",
    email: "Sherlock@uncc.edu",
    address: "Bits 221B",
    city: "Manhattan",
    state: "New York ",
    zipCode: "10009",
    country: "United States of America"
  }
];

getUsers = function() {
  return userList;
};

module.exports = { getUsers };
