// const routes = require('./routes');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const excel = require('./middlewares/excel-processing');
const passport = require('passport');
const flash = require('connect-flash');

app = express(); // Express instance created!


require('./config/passport')(passport); // pass passport for configuration
app.use(morgan('dev'));
app.use(cookieParser()); // read cookies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// required for passport
app.use(session({
    secret: 'mysecretispony',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use("/js", express.static(__dirname + '/public/js'));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./app/routes.js')(app, passport);

// GET Requests
// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/public/index.html');
// });
//
// app.post('/', function (req, res) {
//     time = Date.now().toString(); // What is time now?
//     excel.read(time);
//     res.end('Success!');
// });

const port = "8080"; // Port that we listen
//
app.listen(port);
// const io = require('socket.io').listen(app.listen(port)); // Server Loop on entered port
console.log("Run on " + port + " port");

// io.sockets.on('connection', function (socket) {
//     console.log('Client is connected!');
//     socket.emit('message', 'You are connected to server');
//     socket.broadcast.emit('message', 'New Client is connected');
//
//     socket.on('answer', function (message) {
//         console.log(message + " client saying!");
//         socket.emit('message', message);
//     });
// });

// require('socketio-auth')(io, {
//     authenticate: function (socket, data, callback) {
//         //get credentials sent by the client
//         const username = data.username;
//         const password = data.password;
//
//
//         console.log(username + " " + password);

// db.findUser('User', {username:username}, function(err, user) {
//
//     //inform the callback of auth success/failure
//     if (err || !user) return callback(new Error("User not found"));
//     return callback(null, user.password == password);
// });
//     }
// });