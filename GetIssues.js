var login = require('./Login.js');
var request = require('request');
var csvWriter = require('csv-write-stream');
fs = require('fs');
var SprintNumber = '#26';


YouTrackBaseURL = 'https://zettabox.myjetbrains.com/youtrack/rest/issue?filter=';
YouTrackFilter = ("#{" + SprintNumber + "} Type:{Technical}Type:{User Story}Type:{Bug}Project:-{Zettabox.Qa}");
var YouTrackURL = YouTrackBaseURL + encodeURIComponent(YouTrackFilter) + '&max=1';

exports.getIssues = function getIssues(cb) {
    login.logon(function(err, setcookie) {

        var options = {
            url: YouTrackURL,
            //url: 'https://zettabox.myjetbrains.com/youtrack/rest/issue?filter=%23{%2324}+Type%3A+{User+Story}++Type%3A+{Bug}&max=100',
            headers: {
                'Cookie': setcookie.join(" ; "),
            }
        };
        if (setcookie) {
            var project = request.get(options, function(e, r, Issues) {
                var parseString = require('xml2js').parseString;

                parseString(Issues, function(err, result) {
                  var writer = csvWriter({ headers: ["Name","Story points", "Assignee","State", "Type"]});
                  writer.pipe(fs.createWriteStream('out.csv'));
                  var row = [];

                    //console.log(result.issueCompacts.issue);
                    //console.log(JSON.stringify(result.issueCompacts.issue[1].field[1].value[0], null, 4));
                    //console.log(result);

                    // if(err){
                    //   return cb(err);
                    // }
                    result.issueCompacts.issue.forEach(function(item) {
                        item.field.forEach(function(field) {
                            if (field.$.name == 'Story Points') {
                                console.log(item.$.id);
                                row[0] = item.$.id;
                                row[1] = field.value[0];
                                console.log('\t',field.value[0]);
                            }
                        });
                        item.field.forEach(function(field) {
                            if (field.$.name == 'Assignee') {
                                row[2] = field.value[0].$.fullName;
                                console.log('\t',  field.value[0].$.fullName);
                            }
                            if (field.$.name == 'State') {
                                row[3] = field.value[0];
                                console.log('\t',  field.value[0]);
                            }
                            if (field.$.name == 'Type') {
                                row[4] = field.value[0];
                                console.log('\t', field.value[0]);
                            }
                        });
                        item.field.forEach(function(field) {
                            if (field.$.name == 'summary') {
                                row[4] = field.value[0];
                                console.log('\t', field.value[0]);
                            }
                        });
                        writer.write([row[0],row[1], row[2],row[3],row[4] ]);
                    });

                    cb(null, result);
                });
            });
        }
    });
};

//exports.getIssues = getIssues;
