// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const sql = require('./../middlewares/database/database');
const mysql = require('mysql');
const configuration = require('./config');

let config = configuration.dbconfig;
config.database = configuration.dbname;

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();

module.exports = function (passport) {

    // serialize the user for the session
    passport.serializeUser(function (user, done) {
        console.log('serialize');
        done(null, user.id);
    });

    // deserialize user
    passport.deserializeUser(function (id, done) {
        // pool.query('SELECT * FROM users WHERE id = ? ', [id], function (err, rows) {
        connection.query('SELECT * FROM users WHERE id = ? ', [id], function (err, rows){
            if (err) return done(err);
            console.log('deserialize');
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
                    console.log(username);
                    console.log(rows);
                    if (err) return done(err);

                    if (!rows.length) {
                        console.log('No user');
                        return done(null, false);
                    }

                    // if the user is found but the password is wrong
                    if (password != rows[0].password) {
                        console.log(password + ': ' + rows[0].password);
                        console.log('Wrong password!');
                        return done(null, false);
                    }

                    console.log('Is fine');
                    return done(null, rows[0]);
                });
            })
    );
};