const config = {};

/* PORT CONFIGURATION */
config.port = '8080';

/* DATABASE CONFIGURATION */
config.dbname = 'test_db';
config.dbconfig = {
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: ''
};

/* EMAIL CONFIGURATION */
// * If you want to change smtp server -> ./email.js
config.emailUsername = '';
config.emailPassword = '';

/* SECRET FOR PASSPORT (change this please) */
config.secret = 'mysecretispony';

/* ZZAP CONFIGURATION */
config.api_key = '';

/* CLIENTSIDE MUST BE CHANGED DIRECTLY! */
// ./public/js/socket.js SECOND ROW

module.exports = config;