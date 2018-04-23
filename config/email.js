const config = require('./config');
exports.config = {
    host: 'smtp.yandex.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: config.emailUsername,
        pass: config.emailPassword
    }
};