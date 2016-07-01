var request = require('request');
var xml2js = require('xml2js');

var login = require('./Login.js');
var issues = require('./GetIssues.js');

login.logon(function(err, setcookie) {

    var options = {
        url: 'https://zettabox.myjetbrains.com/youtrack/rest/admin/project',
        headers: {
            'Cookie': setcookie.join(" ; "),
        }
    };

    if (setcookie) {
        var project = request.get(options, function(e, r, XMLprojects) {
            //console.log(XMLprojects);
            //console.log(r.statusCode);
            var parseString = require('xml2js').parseString;
            parseString(XMLprojects, function(err, result) {
                //console.dir(result);
                result.projectRefs.project.forEach(function(item) {
                    //console.log(item.$.id, ' ', item.$.url);

                });
            });

        });
        //console.log(project);
    }
});

issues.Issues();