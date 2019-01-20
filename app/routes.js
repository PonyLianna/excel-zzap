const myfile = require('../middlewares/fileUpload');
const excel = require('../middlewares/excelProcessing');
const database = require('../middlewares/database/database');
const cron = require('../middlewares/cron');
const configuration = require('../config/config');
const path = require('path');
const fs = require('fs');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = function (app, passport, io) {
    cron.init();

    // Home page
    app.get('/', isLoggedIn, function (req, res) {
        res.sendFile('index.html', {root: './public'});
    });

    app.post('/', isLoggedIn, async function (req, res) {
        await database.cleanTables();
        const filename = await myfile.readExcel(req, res);
        await excel.csv(filename, 'main.csv');
        await waitFor(5000);
        logger.info('Файл загружен в базу данных');
        res.end('Файл загружен');
    });

    app.get('/temp', isLoggedIn, function (req, res) {
        fs.readdir(configuration.csv.path, async (err, files) => {
            res.render('temp', {
                title: 'Hey',
                final: files.map((file) => `${req.get('host')}/temp/final/${file}`),
                uploads: [`${req.get('host')}/temp/uploads/main.xlsx`, `${req.get('host')}/temp/uploads/main.csv`]
            });
        })
    });

    app.get('/temp/final/:filename(*)', isLoggedIn, async function (req, res) {
        if (req.params && req.params.filename) {
            const local_path = path.join(configuration.csv.path, req.params.filename);
            fs.exists(local_path, function (exists) {
                if (exists)
                    res.download(path.join(configuration.csv.path, req.params.filename));
                else
                    res.render('error', {error: 'Ошибка: Введено неправильное название файла'});
            })
        }
    });

    app.get('/temp/uploads/:filename(*)', isLoggedIn, async function (req, res) {
        if (req.params && req.params.filename) {
            const local_path = path.join(`${__filename}/../../uploads`, req.params.filename);
            console.log(local_path);

            fs.exists(local_path, function (exists) {
                if (exists)
                    res.download(local_path);
                else
                    res.render('error', {error: 'Ошибка: Введено неправильное название файла'});
            })
        }
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
            logger.info('Пройдена авторизация');

            if (req.body.remember) {
                req.session.cookie.maxAge = 60 * 60;
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
    logger.info('Попытка авторизации при помощи существующей сессии');
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        logger.info('Пользователь авторизован');
        return next();
    }
    res.redirect('/login');
}
