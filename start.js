// const routes = require('./routes');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const passportSocketIo = require('passport.socketio');
const MySQLStore = require('connect-mysql')(session);

const options = {
    config: require('./config/db').pool_config
    // config: {
    //     user: 'root',
    //     password: '',
    //     database: 'my_db'
    // }
};

const Server = require('http').Server;

app = express(); // Express instance created!
server = Server(app);
const io = require('socket.io')(server);

require('./config/passport')(passport); // pass passport for configuration
app.use(morgan('dev'));
app.use(cookieParser()); // read cookies
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// required for passport
const config = {
    cookieParser: require('cookie-parser'),
    secret: 'mysecretispony',
    resave: true,
    saveUninitialized: true,
    store: new MySQLStore(options)
};

app.use(session(config)); // session secret
io.use(passportSocketIo.authorize(config));

app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
//
require('./app/routes.js')(app, passport);
require('./app/socket.js')(io);

const port = require('./config/port').port;
server.listen(port);

console.log('Run on ' + port + ' port');
