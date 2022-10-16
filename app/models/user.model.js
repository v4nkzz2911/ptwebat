const sql = require("./db");

const User = function(user){
    this.username = user.username;
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.phone = user.phone;
    this.address = user.address;
    this.isForgot = user.isForgot;
    this.role = user.role;
};

User.create = (newUser, result) => {
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created user: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
    });
};



User.showAll = (result) => {
    let query = "SELECT * FROM users";
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("todo: ", res);
        result(null, res);
    });
};

User.findByEmail = (email, result) => {
    sql.query(`SELECT * from users WHERE email = '${email}'`, (err, res) => {
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

User.findByUsername = (username, result) => {
    sql.query(`SELECT * from users WHERE username = '${username}'`, (err, res) => {
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

User.verify = (email, result) => {
    sql.query(
        "UPDATE users SET email_verified_at = ? WHERE email = ?",
        [new Date(), email],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { email: email });
        }
    );
}

User.resetPassword = (email, password, result) => {
    sql.query(
        "UPDATE users SET password = ? WHERE email = ?",
        [password, email],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { email: email });
        }
    );
};

User.updateisForgotPasswordStatus1 = (email, result) => {
    sql.query(
        "UPDATE users SET isForgot = 1 WHERE email = ?",
        [email],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { email: email });
        }
    );
};

User.updateisForgotPasswordStatus0 = (email, result) => {
    sql.query(
        "UPDATE users SET isForgot = 0 WHERE email = ?",
        [email],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { email: email });
        }
    );
};



module.exports = User;