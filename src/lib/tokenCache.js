const redis = require("redis");
const client = redis.createClient();

client.on('connect', (err, data) => {
  console.log('Connected to Redis');
});

client.on('error', (err, data) => {
  if (err.code === 'ECONNREFUSED') {
    console.error('Lost connection to Redis');
  } else {
    console.error(`An error with code: ${err.code} occurred`);
    console.error(err);
  }
});

const TOKEN_EXPIRATION_TIME = 1200 //in seconds

function saveToken(email, token) {
  client.set(email, token, 'EX', TOKEN_EXPIRATION_TIME);
}

function getToken(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

function getTTL(key) {
  return new Promise((resolve, reject) => {
    client.ttl(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

function doesKeyExist(key) {
  return new Promise((resolve, reject) => {
    client.exists(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

function expireTokenImmediately(key) {
  client.expire(key, 0);
}

module.exports = {
  saveToken: saveToken,
  getToken: getToken,
  getTTL: getTTL,
  doesKeyExist: doesKeyExist,
  expireTokenImmediately: expireTokenImmediately
}