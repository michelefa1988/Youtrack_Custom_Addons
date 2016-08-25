var request = require('request');

var login = require('./Login.js');
var issues = require('./GetIssues.js');
var ExportToPDF = require('./ExportToPDF');

function HelpNeeded() {
  if (process.argv.indexOf("--help") != -1) { //does our flag exist?
    console.log("------------------------------------------------------------------------------------------");
    console.log("Youtrack helper tool");
    console.log("");
    console.log("-email --> Enter valid youtrack email address");
    console.log("-pass --> Enter a valid youtrack password");
    console.log("------------------------------------------------------------------------------------------");
    return true;
  }
  return false;
}

//if help flag is mot needed -> begin processeing
if (!HelpNeeded()) {
    login.logon(function(err, setcookie) {
        if (!err) {
            var options = {
                url: 'https://zettabox.myjetbrains.com/youtrack/rest/admin/project',
                headers: {
                    'Cookie': setcookie.join(" ; "),
                }
            };
            var ticketsArr = [];
            issues.getIssues(function(error, ticketsArr) {
                console.log("********CALLBACK*********************");

                //console.log(ticketsArr);
                ExportToPDF.writetoPDF();

            });
        }
    });
}
