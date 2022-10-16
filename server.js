const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

require('dotenv/config');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.set('views', 'app/views');
app.set('layout','./partials/layout')

app.use(express.static('app/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}))

const login = require('./app/controllers/auth/login.controller');
const authMiddleware = require('./app/middlewares/auth.middleware');

app.get('/', authMiddleware.isAuth, login.showLoginForm)

require('./app/routes/route')(app);

app.listen(3000, function() {
    console.log('server running: http://localhost:3000');
});
