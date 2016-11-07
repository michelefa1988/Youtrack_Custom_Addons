var request = require('request');
var config = require("./config.js");

var login_form = {
    login: config.YouTrack_Email,
    password: config.YouTrack_Password,
};

function Logon(cb) {
    request.post({
        url: config.YouTrack_Login_URL,
        form: login_form
    }, function(e, r, body) {
        if (r.statusCode != 200 || e !== null) {
            console.log("Error " + r.statusCode);
            return;
        }
        var setcookie = r.headers["set-cookie"];
        cb(null, setcookie);
    });
}

exports.logon = Logon;
