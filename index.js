var request = require('request');

var login = require('./Login.js');
var issues = require('./GetIssues.js');
var ExportToPDF = require('./ExportToPDF');
var CompareChanges = require('./CompareChanges');

ArrayToExport = [];

function getSprint() {
    if (process.argv.indexOf("-sprint") != -1) { //does our flag exist?
        return (process.argv[process.argv.indexOf("-sprint") + 1]);
    }
}

function HelpNeeded() {
    if (process.argv.indexOf("--help") != -1) { //does our flag exist?
        console.log("------------------------------------------------------------------------------------------");
        console.log("Youtrack helper tool");
        console.log("");
        console.log("-email --> Enter valid youtrack email address");
        console.log("-pass --> Enter a valid youtrack password");
        console.log("-sprint --> Enter a valid youtrack sprint number eg 31");
        console.log("-changes --> Record only Changes");
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


                //if changes parameter is present
                if (process.argv.indexOf("-changes") != -1) {
                     CompareChanges.processChanges(function(cb) {
                       console.log('***AAAAAAA');
                       console.log('cb is ' + cb);
                       ArrayToExport = cb;

                       //console.log('tickets array is ');
                       //console.log(ticketsArr);

                       ExportToPDF.writetoPDF(function(cb){
                       })
                     });
                }
                else {
                  ArrayToExport = ticketsArr;
                  ExportToPDF.writetoPDF();
                }
            });
        }
    });
}
exports.Sprint = getSprint();
exports.ArrayToExport = ArrayToExport;
