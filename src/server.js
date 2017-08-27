const restify = require('restify');
const port = 5000 || process.env.PORT;
function status(req, res, next) {
  const response = {
    'msg': 'welcome'
  };
  res.send(response);
  next();
}

const server = restify.createServer();
server.get('/status', status);

server.listen(port, () => {
  console.log('%s listening at %s', server.name, server.url);
});