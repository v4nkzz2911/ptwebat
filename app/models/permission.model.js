const sql = require("./db");

const Permission = function(permission){
    this.email = permission.email;
    this.per = permission.per;
};

Permission.checkPermission = (email, result) => {
    sql.query(`SELECT * from permission WHERE email = '${email}'`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0])
            
            return;
        }
        result(null, null);
    });
}

module.exports = Permission;