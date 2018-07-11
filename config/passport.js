// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const sql = require('./../middlewares/database/database');
// const pool = require('./../middlewares/database/database').pool;
const mysql = require('mysql');
// const connection = require('');
let config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "testing2"
};
let connection = mysql.createConnection(config);

handleDisconnect(connection);

function handleDisconnect(client) {
    client.on('error', function (error) {
        if (!error.fatal) return;
        if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw err;

        console.error('> Re-connecting lost MySQL connection: ' + error.stack);

        // NOTE: This assignment is to a variable from an outer scope; this is extremely important
        // If this said `client =` it wouldn't do what you want. The assignment here is implicitly changed
        // to `global.mysqlClient =` in node.
        connection = mysql.createConnection(client.config);
        handleDisconnect(connection);
        connection.connect();
    });
}
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