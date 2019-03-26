const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const passportSocketIo = require('passport.socketio');
const MySQLStore = require('connect-mysql')(session);

global.logger = require('./middlewares/logger').main();
global.stop = false; //stop variable
// global.logger = require('./middlewares/logger').main();

const options = {config: require('./config/config').dbconfig};
options.config.database = require('./config/config').dbname;

const Server = require('http').Server;

app = express(); // Express instance created!
server = Server(app);
const io = require('socket.io')(server);

require('./middlewares/passport')(passport); // pass passport for configuration
// app.use(morgan('combined', { 'stream': logger.stream}));
app.use(cookieParser()); // read cookies
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// required for passport
const config = {
    cookieParser: require('cookie-parser'),
    secret: require('./config/config').secret,
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

app.set('view engine', 'ejs');

require('./app/routes')(app, passport, io);
require('./app/socket').main(io);

const port = require('./config/config').port;
server.listen(port);

logger.info('Запускаем на порте ' + port);
