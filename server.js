const express = require('express');
const expressWs = require('express-ws');
const PORT = 3000;
const app = expressWs(express()).app;
const faker = require('faker');
const createWebpackMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
const http = require('http');
const compiler = require('webpack')(config);
const webpackMiddleware = createWebpackMiddleware(compiler, config);
const cors = require('cors');
var clients = [];
let users = [{
    user_id: 0,
    user_name: faker.name.firstName(),
    user_image: faker.image.avatar()
}];

const createUser = (id = 1) => {
    return {
        user_id: id,
        user_name: faker.name.firstName(),
        user_image: faker.image.avatar()
    }
};


app.use(cors());
app.use(webpackMiddleware);
app.use(require("webpack-hot-middleware")(compiler));
app.use(function (req, res, next) {
    // console.log('middleware', users);
    req.testing = 'testing';
    return next();
});
app.use(express.static(__dirname + '/App'));

app.get('/', function (req, res, next) {
    res.sendFile('index.html');
    // console.log('get route', req.testing);
    res.end();
    return next();
});

const server = new http.Server(app);
const io = require('socket.io')(server);

server.listen(PORT);

io.on('connection', (socket) => {
    // <insert relevant code here>
    clients.push(socket);
    users.push(createUser(socket.id));
    io.emit('users',  users );
    // socket.send(users);
    socket.on('disconnect', function () {
        clients.splice(clients.indexOf(socket), 1);
        users.splice(clients.indexOf(socket.id), 1);
        io.emit('users', users);
    });
});