module.exports = function (app, passport, excel) {
    // =====================================
    // HOME PAGE ===========================
    // =====================================
    app.get('/', isLoggedIn, function (req, res) {

        res.sendFile('index.html', {root: './public'});
        // const time = Date.now().toString(); // What is time now?
        // excel.read(time);
        // res.end('Success!');
    });

    // =====================================
    // ADMIN ===============================
    // =====================================
    app.get('/admin', isAdmin, function (req, res) {
        console.log('YOU\'RE ADMIN!');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
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
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 60 * 60; // 1 hour
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/login');
        });

    // =====================================
    // LOGOUT ==============================
    // =====================================
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
    if (req.isAuthenticated() && req.user.super == "1")
        return next();
    res.redirect('/');
}