const login = require('../controllers/auth/login.controller');
const register = require('../controllers/auth/register.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const handlePassword = require('../controllers/auth/handlePassword.controller');

module.exports = app => {
    var router = require('express').Router();

    router.get('/login', authMiddleware.isAuth, login.showLoginForm)
    .post('/login', login.login)

    .get('/register', authMiddleware.isAuth, register.create)
    .post('/register', register.register)

    .get('/logout', authMiddleware.loggedin, login.logout)

    

    .get('/verify', register.verify)


    .get('/password/changepass', authMiddleware.loggedin, handlePassword.showChangePasswordForm)
    .post('/password/changepass',authMiddleware.loggedin,handlePassword.change)

    .get('/password/reset', handlePassword.showForgotForm)
    .post('/password/email', handlePassword.sendResetLinkEmail)

    .get('/password/reset/:email', handlePassword.showResetForm)
    .post('/password/reset', handlePassword.reset)


    app.use(router);
}