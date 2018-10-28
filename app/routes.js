const myfile = require('../middlewares/fileUpload');
const excel = require('../middlewares/excelProcessing');
const database = require('../middlewares/database/database');
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
        const filename = await myfile.readExcel(req, res);
        await excel.csv(filename, 'main.csv');
        await waitFor(5000);
        logger.info('Файл загружен в базу данных');
        res.end('Файл загружен');
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
    if (req.isAuthenticated()){
        logger.info('Пользователь авторизован');
        return next();
    }
    res.redirect('/login');
}
