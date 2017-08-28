const User = require('../models/user')
const auth = require('./auth')
const jwtUtils = require('./jwtUtils')

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

async function login(email, password) {
  const foundUser = await User.findOne({email: email});
  if (foundUser !== null && foundUser.email === email) {
    const dbHashedPassword = foundUser.password;
    const doesPasswordMatch = await auth.checkPassword(password, dbHashedPassword);
    if (doesPasswordMatch === true) {
      console.log(`User with email ${email} has supplied correct password`);
      const token = await jwtUtils.issueToken(foundUser);
      return token;
    } else {
      console.log(`User with email ${email} has supplied incorrect password`);
      return null;
    }
  } else {
    console.log(`Cannot find user with email: ${email}`);
    return null;
  }
}

async function getUserData(email) {
  const foundUser = await User.findOne({email: email});
  return foundUser;
}

module.exports = {
  register: register,
  login: login,
  getUserData: getUserData
};
