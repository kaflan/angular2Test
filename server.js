const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const faker = require('faker');
const createWebpackMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
const compiler = require('webpack')(config);
const webpackMiddleware = createWebpackMiddleware(compiler, config);

let users = [  {
        user_id: 0,
        user_name: faker.name.firstName(),
        user_image: faker.image.avatar()
    }];
const createUser =  () => {
    return {
        user_id: users.length++,
        user_name: faker.name.firstName(),
        user_image: faker.image.avatar()
    }
};

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '0.0.0.0');

app.use(webpackMiddleware);
app.use(require("webpack-hot-middleware")(compiler));
app.use(function (req, res, next) {
  console.log('middleware', users);
  req.testing = 'testing';
  return next();
});
app.use(express.static(__dirname + '/App'));

app.get('/', function(req, res, next){
  res.sendFile('index.html');
});
 
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    users.push(createUser());
    ws.send(users);  
    console.log(msg);
  });
  ws.onclose = function(event) {
      console.log(event);
  };
  console.log('socket', req.testing);
});
 
app.listen(app.get('port'), app.get('host'), webpackMiddleware.listen);