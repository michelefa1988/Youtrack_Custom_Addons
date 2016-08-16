var request = require('request');
var LoginURL = 'https://zettabox.myjetbrains.com/youtrack/rest/user/login';

function getEmail() {
    if (process.argv.indexOf("-email") != -1) { //does our flag exist?
        return (process.argv[process.argv.indexOf("-email") + 1]);
    }
}

function getPass() {
    if (process.argv.indexOf("-pass") != -1) { //does our flag exist?
        return (process.argv[process.argv.indexOf("-pass") + 1]);
    }
}

var login_form = {
    login: getEmail(),
    password: getPass(),
};

function Logon(cb) {
    request.post({
        url: LoginURL,
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
