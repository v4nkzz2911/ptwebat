exports.loggedin = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user
        next();
    } else {
        res.redirect('/login')
    }
}

exports.isAuth = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user
        res.redirect('/home');
    } else {
        next();
    }
}

exports.isAdmin = (req, res, next) => {
    if ((req.session.loggedin)&&(req.session.user.role =="0")) {
        res.locals.user = req.session.user
        next();
    } else {
        res.redirect('/404')
    }
}
