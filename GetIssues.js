var login = require('./Login.js');
var request = require('request');
var csvWriter = require('csv-write-stream');
fs = require('fs');
var SprintNumber = '#28';


YouTrackBaseURL = 'https://zettabox.myjetbrains.com/youtrack/rest/issue?filter=';
YouTrackFilter = ("#{" + SprintNumber + "} Type:{Technical}Type:{User Story}Type:{Bug}Project:-{Zettabox.Qa}Project:-{ZettaBox.OSX.Client}");
//YouTrackFilter = ("#ZettaBox_Web_NextGen-531 #ZettaBox_Web_NextGen-532");
YouTrackURL = YouTrackBaseURL + encodeURIComponent(YouTrackFilter) + '&max=777';


ticketsArr = [];

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
                    var writer = csvWriter({
                        headers: ["Name", "Story points", "Assignee", "State", "Type", "Description", "url"]
                    });
                    writer.pipe(fs.createWriteStream('out.csv'));

                    var SumStoryPoints = 0;
                    var NoOfStories = 0;

                    result.issueCompacts.issue.forEach(function(item) {
                        var ticket = [];
                        ticket[2] = 'Unassigned';
                        item.field.forEach(function(field) {
                            if (field.$.name == 'Story Points') {
                                //console.log(item.$.id);
                                ticket[0] = item.$.id;
                                ticket[1] = field.value[0];
                                //console.log('\t', field.value[0]);
                                SumStoryPoints = SumStoryPoints + parseInt(field.value[0]);
                                NoOfStories++;
                            }
                        });
                        item.field.forEach(function(field) {
                            if (field.$.name == 'State') {
                                ticket[3] = field.value[0];
                                //console.log('\t', field.value[0]);
                            }
                            if (field.$.name == 'Type') {
                                ticket[4] = field.value[0];
                                //console.log('\t', field.value[0]);
                            }
                        });
                        item.field.forEach(function(field) {
                          if (field.$.name == 'Assignee') {
                              ticket[2] = field.value[0].$.fullName;
                              //console.log('\t', field.value[0].$.fullName);
                          }

                        });
                        item.field.forEach(function(field) {
                            if (field.$.name == 'summary') {
                                ticket[5] = field.value[0];
                                //console.log('\t', field.value[0]);
                            }
                        });
                        writer.write(ticket);
                        ticketsArr.push(ticket);
                    });
                    console.log("Story Points SUM: " ,SumStoryPoints);
                    console.log("Number of Stories: " ,NoOfStories);
                    cb(null, ticketsArr);
                });
            });
        }
    });
};

//exports.getIssues = getIssues;
