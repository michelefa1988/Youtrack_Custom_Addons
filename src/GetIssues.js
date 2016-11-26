var login = require('./Login.js');
var request = require('request');
var csvWriter = require('csv-write-stream');
var conf = require('./config.js');
fs = require('fs');

ticketsArr = [];

exports.getIssues = function getIssues(cb) {
    login.logon(function(err, setcookie) {

        var options = {
            //url: YouTrackURL,
            url: conf.YouTrack_URL,
            headers: {
                'Cookie': setcookie.join(" ; "),
            }
        };
        if (setcookie) {
            var project = request.get(options, function(e, r, Issues) {
                var parseString = require('xml2js').parseString;


                parseString(Issues, function(err, result) {
                    var writer = csvWriter({
                        headers: conf.CSV_Headers
                    });

                    writer.pipe(fs.createWriteStream(conf.CSV_FileName));

                    var SumStoryPoints = 0;
                    var NoOfStories = 0;

                    result.issueCompacts.issue.forEach(function(item) {
                        var ticket = [];

                        for (var i = 0 ; i < conf.Youtrack_Fields.length ; i++)
                        {
                          ticket[i]= 'Unassigned';

                          if (conf.Youtrack_Fields[i].toLowerCase() == "id") {
                            ticket[i] = item.$.id;
                          }

                          item.field.forEach(function(field) {
                            if (field.$.name == "Assignee" && field.$.name == conf.Youtrack_Fields[i]) {
                              ticket[i] = field.value[0].$.fullName
                            }
                            else if (field.$.name == conf.Youtrack_Fields[i]) {
                                   ticket[i] = field.value[0];
                              }
                          });
                        }
                        writer.write(ticket);
                        //to paramaterize
                        SumStoryPoints = SumStoryPoints + parseInt(ticket[1]);
                        ticketsArr.push(ticket);
                        NoOfStories++;

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
