const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const configuration = require('./../config/config');

let config = configuration.dbconfig;
config.database = configuration.dbname;

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(config); // Recreate the connection, since
    // the old one cannot be reused.

    logger.info('Пересоздаем соединение');
    connection.connect(function (err) {
        if (err) {
            logger.warn('Ошибка соединения к базе данных', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = function (passport) {

    // serialize the user for the session
    passport.serializeUser(function (user, done) {
        logger.debug('Выделяем пользователю сессию');
        done(null, user.id);
    });

    // deserialize user
    passport.deserializeUser(function (id, done) {
        connection.query('SELECT * FROM users WHERE id = ? ', [id], function (err, rows) {
            if (err) return done(err);
            logger.debug('Убираем у пользователя сессию');
            done(err, rows[0]);
        });
    });

    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function (req, username, password, done) {
                connection.query('SELECT * FROM users WHERE name = ?', [username], function (err, rows) {
                    if (err) return done(err);

                    if (!rows.length) {
                        logger.debug('Данного пользователя не сущетсвует');
                        return done(null, false);
                    }

                    // if the user is found but the password is wrong
                    if (password != rows[0].password) {
                        logger.debug(password + ': ' + rows[0].password);
                        logger.debug('Неправильный пароль');
                        return done(null, false);
                    }

                    logger.debug('Пароль правильный');
                    return done(null, rows[0]);
                });
            })
    );
};