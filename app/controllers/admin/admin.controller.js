const User = require('../../models/user.model');
const Permission = require('../../models/permission.model')
const bcrypt = require('bcrypt');


exports.showUserManager = (req, res) => {
    User.showAll((err,users)=>{
        users.forEach(item => {
            if (item.role == "1"){
                item.per ="";
                let temp="";
                Permission.checkPermission(item.email,(err,per) => {
                    console.log(per.per);
                })
                
                
            }
            console.log(item)
        });
        res.render('admin/manageUser',{
            users: users,
        });
    })
}

exports.viewUser = (req, res) => {
    User.findByEmail(req.params.email,(err,user)=>{
        res.render('admin/viewUser',{
            targetUser: user,
        });
    })
}



