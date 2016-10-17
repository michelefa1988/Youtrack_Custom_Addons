var login = require('./Login.js');
var request = require('request');
var csvWriter = require('csv-write-stream');
fs = require('fs');


function getSprint() {
    if (process.argv.indexOf("-sprint") != -1) { //does our flag exist?
        return (process.argv[process.argv.indexOf("-sprint") + 1]);
    }
}
//var SprintNumber = '#31';
var SprintNumber = '#' + getSprint();
//link copied from youtrack. Replace text after filer= with text after q= in browser
//YouTrackBaseURL =  'https://zettabox.myjetbrains.com/youtrack/rest/issue?filter=%23ZettaBox_Web_NextGen-580+%23ZettaBox_Web_NextGen-585+%23ZettaBox_Web_NextGen-582+%23ZettaBox_Web_NextGen-569+%23ZettaBox_Web_NextGen-568+%23ZettaBox_Web_NextGen-567+';
//YouTrackURL = YouTrackBaseURL  + '&max=777';


//standard priont sprint
YouTrackBaseURL = 'https://zettabox.myjetbrains.com/youtrack/rest/issue?filter=';
//YouTrackFilter = ("#ZettaBox_Web_NextGen-730 #ZettaBox_Web_NextGen-782 #ZettaBox_Web_NextGen-784  #ZettaBox_Web_NextGen-786 #ZettaBox_Web_NextGen-596");
YouTrackFilter = ("#{" + SprintNumber + "} Type:{Technical}Type:{User Story}Type:{Bug}Project:-{ZettaBox.OSX.Client}");
//YouTrackFilter = ("#ZettaBox_Web_NextGen-611 #ZettaBox_Web_NextGen-612 #ZettaBox_Web_NextGen-609  ZettaBox_Web_NextGen-610");
YouTrackURL = YouTrackBaseURL + encodeURIComponent(YouTrackFilter) + '&max=3000';


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
                        headers: ["Name", "Story points", "Assignee", "State", "Type",  "Team","Description"]
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
                          if (field.$.name == 'Team') {
                              ticket[5] = field.value[0];
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
                                ticket[6] = field.value[0];
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
