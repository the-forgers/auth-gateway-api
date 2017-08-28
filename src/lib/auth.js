/**
 * @module Authentication functions
 */

const bcrypt = require('bcrypt');

/**
* Generates a hashed password given a plaintext password. The function uses bcrypt
to hash the password over a number of rounds with a randomly generated
cryptographic salt. The more rounds, the more secure the hash with the trade-off
of time to generate the hash. The hashed password is returned ready to be saved.
* @param  {String}   password   plaintext password
* @return {Function}            callback
*/
const generatePassword = async function(password) {
  try {
    var hashRounds = 12;    //More rounds == more secure but takes longer to generate
    //A cryptographic salt is first generated...
    const salt = await bcrypt.genSalt(hashRounds);
    //...then the salt is combined with the plaintext password...
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error(err);
    return err;
  }
};

/**
* Compares a plaintext password (typically given by the user) with hashed
password (stored on the database). Simply returns true or false depending
on whether the hash computed from the given plaintext password matches the
hash stored on the db.
* @param  {String}   givenPassword      plaintext password to check
* @param  {String}   dbHashedPassword   stored hashed password
* @return {Function}                    callbacks
*/
const checkPassword = async function(givenPassword, dbHashedPassword) {
  try {
    return await bcrypt.compare(givenPassword, dbHashedPassword);
  } catch (err) {
    console.error(err);
    return err;
  }
};

module.exports = {
    generatePassword: generatePassword,
    checkPassword: checkPassword
};
