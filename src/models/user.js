/* User model. */

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  dateRegistered: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
