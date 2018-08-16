const myfile = require('../middlewares/fileUpload');
const excel = require('../middlewares/excelProcessing');
const mysql = require('../middlewares/database/init');
const database = require('../middlewares/database/database');
const codecat = require('../middlewares/codecat');
const email = require('../middlewares/postman');
const dataProcessing = require('../middlewares/dataProcessing');
const cron = require('../middlewares/cron');

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = function (app, passport, io) {
    cron.init();
    // Home page
    app.get('/', isLoggedIn, function (req, res) {
        res.sendFile('index.html', {root: './public'});
    });

    app.post('/', isLoggedIn, async function (req, res) {
        await database.cleanTables();
        // const time = Date.now().toString();
        const filename = await myfile.readExcel(req, res); //, time
        res.end('File has uploaded');
        await excel.csv(filename, 'main.csv');
        await waitFor(5000);
        await mysql.db_csv('main.csv', 'pre_excel');
        await codecat.codecat();
        await database.insertTables();
        await database.findPrices();
        await dataProcessing.export(await database.selectAll());
    });

    app.get('/login', function (req, res) {
        res.sendFile('login.html', {root: './public'});
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }),
        function (req, res) {
            console.log('hello');

            if (req.body.remember) {
                req.session.cookie.maxAge = 60 * 60; // 1 hour
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/login');
        });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.get('*', function (req, res) {
        res.redirect('/login');
    });
};

function isLoggedIn(req, res, next) {
    console.log('Are u logged?');
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
