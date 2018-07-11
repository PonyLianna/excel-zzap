const config = require('./config');
exports.config = {
    service: "Yandex",
    auth: {
        user: config.emailUsername,
        pass: config.emailPassword
    },tls:{
        rejectUnauthorized: false
    }
};