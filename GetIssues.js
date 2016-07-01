var login = require('./Login.js');
var request = require('request');
var SprintNumber = '#24';

YouTrackBaseURL = 'https://zettabox.myjetbrains.com/youtrack/rest/issue?filter=';
YouTrackFilter = ("#{"+ SprintNumber + "} Type:{User Story}Type:{Bug}");
var YouTrackURL = YouTrackBaseURL + encodeURIComponent(YouTrackFilter) + '&max=100';

function getIssues(cb) {
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
                    //console.log(result.issueCompacts.issue);
                    //console.log(JSON.stringify(result.issueCompacts.issue[1].field[1].value[0], null, 4));
                    //console.log(result);

                    result.issueCompacts.issue.forEach(function(item) {
                        item.field.forEach(function(field) {
                            if (field.$.name == 'Story Points') {
                                console.log(item.$.id, ',', field.value[0]);
                            }
                        });
                        item.field.forEach(function(field) {
                            if (field.$.name == 'summary') {
                                console.log('       ', field.value[0]);
                            }
                        });
                    });
                });
            });
        }
    });
}

exports.Issues = getIssues;
