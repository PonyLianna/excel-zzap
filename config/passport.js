// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const sql = require('./../middlewares/database');
const mysql = require('mysql');

// load up the user model
sql.config.database = "my_db";
const connection = mysql.createConnection(sql.config);
console.log(sql.config);
// expose this function to our app using module.exports
module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        console.log('serialize');
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ", [id], function (err, rows) {
            console.log('deserialize');
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function (req, username, password, done) { // callback with email and password from our form
                connection.query("SELECT * FROM users WHERE Имя = ?", [username], function (err, rows) {
                    if (err) return done(err);

                    if (!rows.length) {
                        console.log('No user');
                        return done(null, false); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (password != rows[0].Пароль) {
                        console.log(password + ": " + rows[0].Пароль);
                        console.log('Wrong password!');
                        return done(null, false); // create the loginMessage and save it to session as flashdata
                    }

                    // all is well, return successful user
                    console.log('Is fine');
                    return done(null, rows[0]);
                });
            })
    );
};