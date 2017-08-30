const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateCert = fs.readFileSync('auth-gateway-cert');
const publicCert = fs.readFileSync('auth-gateway-cert.pem');
const TOKEN_EXPIRATION_TIME = 1200; //in seconds

async function issueToken(userData) {
  const token = await jwt.sign(userData, privateCert, {
    algorithm: 'RS512',
    expiresIn: TOKEN_EXPIRATION_TIME
  });
  return token;
}

async function decodeToken(token) {
  try {
    const decoded = await jwt.verify(token, publicCert, { algorithms: ['RS512'] });
    return decoded;
  } catch (err) {
    return err.message;
  }
}

async function isValidToken(token, emailToVerify) {
  if (token) {
    try {
      const decoded = await jwt.verify(token, publicCert, { algorithms: ['RS512'] });
      if (decoded.email === emailToVerify) {
        return true;
      } else {
        return false;
      } 
    } catch (err) {
      return err.message;
    }
    return true;
  } else {
    return false;
  }
}

module.exports = {
  issueToken: issueToken,
  decodeToken: decodeToken,
  isValidToken: isValidToken
};
