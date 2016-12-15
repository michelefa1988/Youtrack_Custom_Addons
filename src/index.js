var request = require('request');
var login = require('./Login.js');
var issues = require('./GetIssues.js');
var ExportToPDF = require('./ExportToPDF');
var CompareChanges = require('./CompareChanges');
var conf = require('./config.js');


ArrayToExport = [];

function LaunchPrintScript(){
  var spawn = require("child_process").spawn,child;
  var arg = "./print.ps1 -path " + __dirname + "\\" + conf.PDF_Name
  console.log(arg);
  child = spawn("powershell.exe", [arg]);
  child.stdout.on("data",function(data){
      console.log("Powershell Data: " + data);
  });
  child.stderr.on("data",function(data){
      console.log("Powershell Errors: " + data);
  });
  child.on("exit",function(){
      console.log("Powershell Script finished");
  });
  child.stdin.end(); //end input
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
        console.log("-print --> Launches powershell script which prints pdf");
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
                       ArrayToExport = cb;
                       ExportToPDF.writetoPDF(true);
                     });
                }
                else {
                  ArrayToExport = ticketsArr;
                  ExportToPDF.writetoPDF(false);
                }
                if (process.argv.indexOf("-print") != -1) {
                  LaunchPrintScript();

                }
            });
        }
    });
}
exports.ArrayToExport = ArrayToExport;
