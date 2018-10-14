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
config.emailConfig = {
    service: "Yandex",
    auth: {
        user: '',
        pass: ''
    },
    tls:{
        rejectUnauthorized: false
    }
};

/* SECRET FOR PASSPORT (change this please) */
config.secret = 'mysecretispony';

/* ZZAP CONFIGURATION */
config.api_key = '';

/* CLIENTSIDE MUST BE CHANGED DIRECTLY! */
// ./public/js/socket.js SECOND ROW

/* Final xlsx configuration */
config.finalExcel = {
    path: "",
    name: "final.xlsx"
};

module.exports = config;