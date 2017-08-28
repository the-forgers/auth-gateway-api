const jwt = require('jsonwebtoken')

const secret = 'secret1234';
const TOKEN_EXPIRATION_TIME = 300 //seconds

async function issueToken(userData) {
  const token = await jwt.sign(userData, secret, {
    expiresIn: TOKEN_EXPIRATION_TIME // expires in 24 hours
  });
  return token;
}

async function isValidToken(token, emailToVerify) {
  if (token) {
    try {
      const decoded = await jwt.verify(token, secret);
      console.log(decoded);
      if (decoded._doc.email === emailToVerify) {
        return true;
      } else {
        return false;
      } 
    } catch (err) {
      return err.message;
    }
    return true
  } else {
    return false;
  }
}

module.exports = {
  issueToken: issueToken,
  isValidToken: isValidToken
};
