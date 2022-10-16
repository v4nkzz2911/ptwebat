const authMiddleware = require('../middlewares/auth.middleware');
const admin = require('../controllers/admin/admin.controller');


module.exports = app => {
    var router = require('express').Router();

    router.get('/user/manager', authMiddleware.isAdmin, admin.showUserManager)
    //.post('/login', login.login)

    .get('/viewUser/:email',authMiddleware.isAdmin,admin.viewUser)

    


    app.use(router);
}