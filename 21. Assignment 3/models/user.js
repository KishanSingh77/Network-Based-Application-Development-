/*class User {
  constructor(
    userId,
    firstName,
    lastName,
    email,
    address,
    city,
    state,
    zipCode,
    country
  ) {
    (this._userId = userId),
      (this._firstName = firstName),
      (this._lastName = lastName);
    (this._email = email), (this._address = address);
    (this._city = city), (this._state = state);
    (this._zipCode = zipCode), (this._country = country);
  }

  get userId() {
    return this._userId;
  }

  set userId(userId) {
    this._userId = userId;
  }

  get firstName() {
    return this._firstName;
  }

  set firstName(firstName) {
    this._firstName = firstName;
  }

  get lastName() {
    return this._lastName;
  }

  set firstName(firstName) {
    this._firstName = firstName;
  }
  get email() {
    return this._email;
  }

  set firstName(email) {
    this._email = email;
  }
  get address() {
    return this._address;
  }

  set address(address) {
    this._address = address;
  }

  get city() {
    return this._city;
  }

  set city(city) {
    this._city = city;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
  }

  get zipCode() {
    return this._zipCode;
  }

  set zipCode(zipCode) {
    this._zipCode = zipCode;
  }

  get country() {
    return this._country;
  }

  set country(country) {
    this._country = country;
  }
}

module.exports = User;
*/
//

let User = function(
  userId,
  firstName,
  lastName,
  email,
  address,
  city,
  state,
  zipCode,
  country
) {
  let userModel = {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    address: address,
    city: city,
    state: state,
    zipCode: zipCode,
    country: country
  };
  return userModel;
};

module.exports = User;
