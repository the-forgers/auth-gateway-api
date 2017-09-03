const User = require('../models/user')
const auth = require('./auth')
const jwtUtils = require('./jwtUtils')
const mongoose = require('mongoose');

let mongoURI = 'mongodb://localhost/auth-gateway';

if (process.env.MONGOLAB_URI) {
  mongoURI = process.env.MONGOLAB_URI;
} else if (process.env.MODE === 'TEST') {
  mongoURI = 'mongodb://localhost/auth-gateway_TEST';
}

mongoose.connect(mongoURI, function(err) {
  if (err) {
      console.error(`Connection to DB (${mongoURI}) error: ${err} \n`);
      process.exit(); //App needs db so we exit when not present
  } else {
      console.log(`Connection to DB (${mongoURI}) successful \n`);
  }
});

async function register(firstName, lastName, email, password) {
  let userToRegister = null;
  let hashedPassword = null;
  const existingUser = await getUserData(email);
  if (existingUser === null) {
    hashedPassword = await auth.generatePassword(password);
    userToRegister = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword
    }
    userToSave = new User(userToRegister);
    return await userToSave.save();
  } else {
    return null;
  }
}

async function login(email, password) {
  const foundUser = await User.findOne({email: email});
  if (foundUser !== null && foundUser.email === email) {
    const dbHashedPassword = foundUser.password;
    const doesPasswordMatch = await auth.checkPassword(password, dbHashedPassword);
    if (doesPasswordMatch === true) {
      console.log(`User with email ${email} has supplied correct password`);
      const userDataToSign = {
        email: foundUser.email,
        mongoDbId: foundUser._id
      };
      const token = await jwtUtils.issueToken(userDataToSign);
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
