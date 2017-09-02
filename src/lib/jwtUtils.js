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
  let payload = {};
  try {
    const decoded = await jwt.verify(token, publicCert, { algorithms: ['RS512'] });
    payload.data = decoded;
    payload.error = null;
    return payload;
  } catch (err) {
    payload.data = null;
    payload.error = err;
    return payload;
  }
}

module.exports = {
  issueToken: issueToken,
  decodeToken: decodeToken
};
