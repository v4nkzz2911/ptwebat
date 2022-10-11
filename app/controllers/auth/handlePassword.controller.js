const User = require('../../models/user.model');
const bcrypt = require('bcrypt');
const mailer = require('../../utils/mailer');
const passgen = require('../../utils/passgen');

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
                const resetPass = passgen(8,true,true);
                console.log(resetPass);
                bcrypt.hash(resetPass, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedPassword) => {
                    User.resetPassword(req.body.email, hashedPassword, (err, result) => {
                        if (!err) {
                            //res.redirect('/login');
                        } else {
                            res.redirect("/500");
                        }
                    })
                    mailer.sendMail(user.email, "Reset password", `Reset Pass: ${resetPass}`)
                    console.log(`${process.env.APP_URL}/password/reset/${user.email} ${resetPass}`);
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

    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const r  = passwordNew.match(re);

    if (passwordNew != passwordRetype) { 
        const conflictError = 'Hai mật khẩu mới nhập không trùng nhau';
        res.render('auth/passwords/change', { conflictError });
        
    } 
    if (!r) { 
        const conflictError = 'Mật khẩu mới không đủ độ mạnh';
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
