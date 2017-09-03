const userUtils = require('./userUtils')
const jwtUtils = require('./jwtUtils')
const tokenCache = require('./tokenCache')

function status(req, res, next) {
  const response = {
    'msg': 'welcome'
  };
  res.send(response);
  return next();
}

async function register(req, res, next) {
  const reqBody = req.body
  const hasUserSuppliedRequiredDetails = reqBody.firstName && reqBody.lastName && reqBody.email && reqBody.password;
  if (reqBody !== undefined && hasUserSuppliedRequiredDetails) {
    try {
      const savedUser = await userUtils.register(reqBody.firstName, reqBody.lastName, reqBody.email, reqBody.password);
      if (savedUser !== null) {
        res.send(201, savedUser);
        return next();
      } else {
        res.send(400, {
          'msg': `registrationFailure, the user with the email: ${reqBody.email} already exists`,
        });
        return next();
      }
    } catch (err) {
      console.error(err);
      res.send(500, err);
      return next();
    }
  } else {
    res.send(400, {
      'msg': 'registrationFailure, insufficient details supplied',
    });
    return next();
  }
}

async function login(req, res, next) {
  const reqBody = req.body;
  if (reqBody !== undefined) {
    try {
      const loginToken = await userUtils.login(reqBody.email, reqBody.password);
      if (loginToken !== null) {
        req.email = reqBody.email
        tokenCache.saveToken(reqBody.email, loginToken);
        res.send(200, {
          'msg': 'loginSuccess',
          'token': loginToken
        });
        return next();
      } else {
        res.send(401, {
          'msg': 'loginFailure, check username/password',
          'token': loginToken
        });
        return next();
      }
    } catch (err) {
      console.error(err);
      res.send(500, err);
      return next();
    }
  } else {
    res.send(400, {
      'msg': 'loginFailure, no login details supplied',
    });
    return next();
  }
}

async function checkToken(req, res, next) {
  const token = req.headers['x-access-token'];
  const decodedToken = await jwtUtils.decodeToken(token);

  if (decodedToken.error === null) {
    const decodedEmail = decodedToken.data.email;
    const tokenFromStore = await tokenCache.getToken(decodedEmail);
    const doesTokenMatchStore = token === tokenFromStore;
    if (doesTokenMatchStore === true) {
      req.decodedToken = decodedToken;
      return next();
    } else {
      res.send(403, { 
        'msg': 'tokenNonExistant',
        'doesTokenMatchStore': doesTokenMatchStore
      });
      return next();
    }
  } else {
    res.send(403, { 
      'msg': 'tokenInValid',
      'decodedToken': decodedToken
    });
    return next();
  }
}

async function getUser(req, res, next) {
  const decodedToken = req.decodedToken;
  const userEmail = decodedToken.data.email;
  const gToken = await tokenCache.getToken(userEmail);
  const ttl = await tokenCache.getTTL(userEmail);
  const userData = await userUtils.getUserData(userEmail);
  res.send(200, userData);
  return next();
}

function logout(req, res, next) {
  const decodedToken = req.decodedToken;
  const userEmail = decodedToken.data.email;
  console.log(`Logging out ${userEmail}`);
  tokenCache.expireTokenImmediately(userEmail);
  res.send(200, { 
    'msg': 'logged out',
    'user': userEmail
  });
  return next();
}

module.exports = {
  status: status,
  register: register,
  login: login,
  checkToken: checkToken,
  getUser: getUser,
  logout : logout
};