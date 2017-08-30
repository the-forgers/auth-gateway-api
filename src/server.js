const restify = require('restify');
const mongoose = require('mongoose');
const port = 5000 || process.env.PORT;

const userUtils = require('./lib/userUtils')
const jwtUtils = require('./lib/jwtUtils')
const tokenStore = require('./lib/tokenStore')

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

function status(req, res, next) {
  const response = {
    'msg': 'welcome'
  };
  res.send(response);
  next();
}

async function register(req, res, next) {
  const reqBody = req.body
  try {
    const savedUser = await userUtils.register(reqBody.firstName, reqBody.lastName, reqBody.email, reqBody.password);
    res.send(201, savedUser);
  } catch (err) {
    console.error(err);
    res.send(500, err);
  }
  return next();
}

async function login(req, res, next) {
  const reqBody = req.body;
  try {
    const loginToken = await userUtils.login(reqBody.email, reqBody.password);
    if (loginToken !== null) {
      req.email = reqBody.email
      tokenStore.saveToken(reqBody.email, loginToken);
      res.send(200, {
        'msg': 'loginSuccess',
        'token': loginToken
      });
    } else {
      res.send(401, {
        'msg': 'loginFailure, check username/password',
        'token': loginToken
      });
    }
  } catch (err) {
    console.error(err);
    res.send(500, err);
  }
}

async function checkToken(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const email = req.body.email || req.query.email || req.headers['x-access-email'];
  const isTokenValid = await jwtUtils.isValidToken(token, email);
  const doesTokenExist = await tokenStore.doesKeyExist(email);
  if (doesTokenExist === 1 && isTokenValid === true) {
    console.log(`Email in check token is ${email}`);
    req.userEmail = email;  // TODO: need to be an decoded email
    return next();
  } else {
    res.send(403, { 
      'msg': 'tokenInValid',
      'doesTokenExist': doesTokenExist,
      'isTokenValid': isTokenValid
    });
  }
}

async function getUser(req, res, next) {
  console.log(req.headers);
  const reqBody = req.body;
  const gToken = await tokenStore.getToken(reqBody.email);
  const ttl = await tokenStore.getTTL(reqBody.email);
  const userData = await userUtils.getUserData(reqBody.email);
  res.send(200, userData);
  next();
}

function logout(req, res, next) {
  const email = req.userEmail;
  console.log(`Logging out ${email}`);
  tokenStore.expireTokenImmediately(email);
  res.send(200, { 
    'msg': 'logged out',
    'user': email
  });
}

const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/status', status);
server.post('/register', register);
server.post('/login', login);
server.post('/checkToken', checkToken);
server.use(checkToken);
server.post('/getUser', getUser);
server.post('/logout', logout);

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});