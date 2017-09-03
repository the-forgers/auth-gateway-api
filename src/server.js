const restify = require('restify');
const port = 5000 || process.env.PORT;

const routeController = require('./lib/routeController')
const server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.get('/status', routeController.status);
server.post('/register', routeController.register);
server.post('/login', routeController.login);
server.post('/checkToken', routeController.checkToken);
server.use(routeController.checkToken);
server.get('/getUser', routeController.getUser);
server.post('/logout', routeController.logout);

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});