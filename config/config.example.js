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
    //  при использовании service
    service: "Yandex",
    
    //  при использовании напрямую smtp
    //  host: 'my.smtp.host', 
    //  port: 465,
    //  secure: true, // использование TLS
    
    // аутентификация обязательна
    auth: {
        user: '',
        pass: ''
    },
    
    // при отсутствии параметра secure не имеет какого-либо смысла
    //     tls:{
    //         rejectUnauthorized: false
    //     }
};

/* SECRET FOR PASSPORT (change this please) */
config.secret = 'mysecretisapony';

/* ZZAP CONFIGURATION */
config.api_key = '';

/* CLIENTSIDE MUST BE CHANGED DIRECTLY! */
// ./public/js/socket.js SECOND ROW

module.exports = config;
