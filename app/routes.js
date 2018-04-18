const myfile = require('../middlewares/fileUpload');
const excel = require('../middlewares/excelProcessing');
const mysql = require('../middlewares/database/init');
const database = require('../middlewares/database/database');
const codecat = require('../middlewares/codecat');
const email = require('../middlewares/postman');
const dataProcessing = require('../middlewares/dataProcessing');
const cron = require('../middlewares/cron');

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = function (app, passport) {
    cron.init();
    // Home page
    app.get('/', isLoggedIn, function (req, res) {
        res.sendFile('index.html', {root: './public'});
    });

    app.post('/', isLoggedIn, async function (req, res) {
        await database.cleanTables();
        const time = Date.now().toString();
        const filename = await myfile.readExcel(req, res, time);
        res.end('File has uploaded');
        await excel.csv(filename, time + '.csv');
        await waitFor(4000);
        await mysql.db_csv(time + '.csv', 'pre_excel');
        await waitFor(4000);
        await codecat.codecat('pre_excel', 'pre_sellers');
        await database.insertTables();
        await database.findPrices();
        await dataProcessing.export(await database.selectAll());

        // socket.emit('message', 'Data is here!');
    });

    app.get('/admin', isAdmin, function (req, res) {
        console.log('YOU\'RE ADMIN!');
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

function isAdmin(req, res, next) {
    console.log('Are u Admin?');
    if (req.isAuthenticated() && req.user.super == '1')
        return next();
    res.redirect('/');
}