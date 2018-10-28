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

/* CSV CONFIGURATION */
config.csv = {
    path: "C:/Temp"
};

/* SECRET FOR PASSPORT (change this please) */
config.secret = 'mysecretisapony';

/* ZZAP CONFIGURATION */
config.api_key = '';

/* CLIENTSIDE MUST BE CHANGED DIRECTLY! */
// ./public/js/socket.js SECOND ROW

module.exports = config;
