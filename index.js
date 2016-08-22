var request = require('request');

var login = require('./Login.js');
var issues = require('./GetIssues.js');
var ExportToPDF = require ('./ExportToPDF');

login.logon(function(err, setcookie) {
    if (!err) {
        var options = {
            url: 'https://zettabox.myjetbrains.com/youtrack/rest/admin/project',
            headers: {
                'Cookie': setcookie.join(" ; "),
            }
        };
        var ticketsArr = [];
        issues.getIssues(function(error,ticketsArr) {
            console.log("********CALLBACK*********************");

            //console.log(ticketsArr);
            ExportToPDF.writetoPDF();

        });
    }
});
