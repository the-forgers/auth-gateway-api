const restify = require('restify');
const mongoose = require('mongoose');
const port = 5000 || process.env.PORT;

const userUtils = require('./lib/userUtils')

let mongoURI = 'mongodb://localhost/auth-gateway';

if (process.env.MONGOLAB_URI) {
    mongoURI = process.env.MONGOLAB_URI;
} else if (process.env.MODE === 'TEST') {
    mongoURI = 'mongodb://localhost/auth-gateway_TEST';
}

mongoose.connect(mongoURI, function(err) {
    if (err) {
        console.error("Connection to DB (" + mongoURI + ") error: " + err + "\n");
        process.exit();     //App needs db so we exit when not present
    } else {
        console.log("Connection to DB (" + mongoURI + ") successful \n");
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
    res.send(500, err);
  }
  return next();
}

const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/status', status);
server.post('/register', register);

server.listen(port, () => {
  console.log('%s listening at %s', server.name, server.url);
});