const authMiddleware = require('../middlewares/auth.middleware');

module.exports = app => {
    var router = require('express').Router();

    router.get('/home', authMiddleware.loggedin, (req, res) => {
        if (req.session.user.isForgot =="1"){
            const conflictError = "Bạn phải đổi mật khẩu sau khi quên mật khẩu";
            res.render("auth/passwords/change",{
                conflictError
            })
        } else{
            res.render('home');
        }
        
    });

    app.use(router);
}