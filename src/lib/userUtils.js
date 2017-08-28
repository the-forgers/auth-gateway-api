const User = require('../models/user')
const auth = require('./auth')

async function register(firstName, lastName, email, password) {
  let userToRegister = null;
  let hPassword = null;
  hPassword = await auth.generatePassword(password);
  console.log(hPassword);
  userToRegister = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hPassword
  }
  userToSave = new User(userToRegister);
  return await userToSave.save();
}

module.exports = {
  register: register
};
