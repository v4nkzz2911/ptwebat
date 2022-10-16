const User = require('../../models/user.model');
const bcrypt = require('bcrypt');

exports.showLoginForm = (req, res) => {
    res.render('auth/login');
}

exports.login = (req, res) => {
    const { email, password } = req.body;
    
    if (email && password) {
        User.findByEmail(email, (err, user) => {
            if (!user) {
                res.redirect('/login');
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result == true) {
                        req.session.loggedin = true;
                        req.session.user = user;
                           
                        if (req.session.user.isForgot == '1'){
                            res.redirect('/password/changepass')
                        }
                        else{
                            //res.redirect('/home');
                            if (req.session.user.role =='0'){
                                req.session.user.MenuBarItem = [
                                    {
                                        label: 'Trang chủ',
                                        link:'/',
                                        active:'0'
                                    },
                                    {
                                        label:'Quản lý người dùng',
                                        link:'/user/manager',
                                        active:'0',
                                    },
                                    {
                                        label:'Quản lý yêu cầu',
                                        link:'',
                                        active:'0',
                                    },
                                ];
                                req.session.user.roleName ='Admin';
                                res.redirect('/home')
                            }
                            else {
                                if (req.session.user.role =='1'){
                                    req.session.user.MenuBarItem = [
                                        {
                                            label: 'Trang chủ',
                                            link:'/',
                                            active:'0'
                                        },
                                        {
                                            label:'Quản lý khách hàng',
                                            link:'',
                                            active:'0',
                                        },
                                        {
                                            label:'Quản lý khảo sát',
                                            link:'',
                                            active:'0',
                                        },
                                    ];
                                    req.session.user.roleName ='Nhân Viên';
                                    res.redirect('/home')
                                }

                                else {
                                    if (req.session.user.role =='2'){
                                        req.session.user.MenuBarItem = [
                                            {
                                                label: 'Trang chủ',
                                                link:'/',
                                                active:'0'
                                            },
                                            {
                                                label:'Thực hiện khảo sát',
                                                link:'',
                                                active:'0',
                                            },
                                            {
                                                label:'Tạo khảo sát',
                                                link:'',
                                                active:'0',
                                            },
                                        ];
                                        req.session.user.roleName ='Khách Hàng';
                                        res.redirect('/home')
                                    }
                                }
                            }
                        } 
                             
                            
                        
                    } else {
                        // A user with that email address does not exists
                        const conflictError = 'Tài khoản hoặc mật khẩu không đúng.';
                        res.render('auth/login', { email, password, conflictError });
                    }
                })
            }
        })
    } else {
        // A user with that email address does not exists
        const conflictError = 'Tài khoản hoặc mật khẩu không đúng.';
        res.render('auth/login', { email, password, conflictError });
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) res.redirect('/500');
        res.redirect('/');
    })
}