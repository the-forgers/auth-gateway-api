const User = require('../models/user')

register = function (firstName, lastName, email, password) {
  return new Promise((resolve, reject) => {
    const userToRegister = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }
    userToSave = new User(userToRegister);
    userToSave.save((err, savedUser) => {
      if (err) {
        console.error(err)
        return reject(err)
      } else {
        console.log(`Saved user with email ${email}`)
        return resolve(savedUser);
      }
    });
  });
}

module.exports = {
  register: register
};
