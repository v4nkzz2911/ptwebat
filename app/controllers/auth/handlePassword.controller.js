const User = require('../../models/user.model');
const bcrypt = require('bcrypt');
const mailer = require('../../utils/mailer');

exports.showForgotForm = (req, res) => {
    res.render('auth/passwords/email');
}

exports.sendResetLinkEmail = (req, res) => {
    if (!req.body.email) {
        res.redirect('/password/reset')
    } else {
        User.findByEmail(req.body.email, (err, user) => {
            if (!user) {
                res.redirect('/password/reset')
            } else {
                bcrypt.hash(user.email, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                    mailer.sendMail(user.email, "Reset password", `<a href="${process.env.APP_URL}/password/reset/${user.email}?token=${hashedEmail}"> Reset Password </a>`)
                    console.log(`${process.env.APP_URL}/password/reset/${user.email}?token=${hashedEmail}`);
                })
                res.redirect('/password/reset?status=success')
            }
        })
    }
}

exports.showResetForm = (req, res) => {
    if (!req.params.email || !req.query.token) {
        res.redirect('/password/reset')
    } else {
        res.render('auth/passwords/reset', { email: req.params.email, token: req.query.token})
    }
}

exports.showChangePasswordForm = (req, res) => {
    res.render('auth/passwords/change');
    console.log(req.session.user)
}


exports.change = (req, res) => {
    const { passwordOld, passwordNew, passwordRetype} = req.body;
    console.log(passwordOld, passwordNew, passwordRetype);
    if (passwordNew != passwordRetype) { 
        const conflictError = 'Hai mật khẩu mới nhập không trùng nhau';
        res.render('auth/passwords/change', { conflictError });
        
    } 
    else {
        bcrypt.compare(passwordOld, req.session.user.password, (err, result) => {
            console.log('compare', result);
            if (result == true) {
                bcrypt.hash(passwordNew, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedPassword) => {
                    User.resetPassword(req.session.user.email, hashedPassword, (err, result) => {
                        if (!err) {
                            res.redirect('/login');
                        } else {
                            res.redirect("/500");
                        }
                    })
                })
            } else {
                const conflictError = 'Không đúng mật khẩu hiện tại';
                res.render('auth/passwords/change', { conflictError });
            }
        })
    }
}



exports.reset = (req, res) => {
    const { email, token, password } = req.body;
    console.log(email, token, password);
    if (!email || !token || !password) { 
        res.redirect('/password/reset');
    } else {
        bcrypt.compare(email, token, (err, result) => {
            console.log('compare', result);
            if (result == true) {
                bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedPassword) => {
                    User.resetPassword(email, hashedPassword, (err, result) => {
                        if (!err) {
                            res.redirect('/login');
                        } else {
                            res.redirect("/500");
                        }
                    })
                })
            } else {
                res.redirect('/password/reset');
            }
        })
    }
}
