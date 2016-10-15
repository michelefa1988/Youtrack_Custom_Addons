var index = require('./index.js');
var loki = require('lokijs');
var db = require('lokijs');

changesArr = [];

module.exports = {
    processChanges: function(cb) {

        var FileName = 'sprints';
        var db = new loki(FileName)
        db.loadDatabase({}, function() {
            var ticketsCollection = db.getCollection()

            if (ticketsCollection === null) {
                //start new database
                var ticketsCollection = db.addCollection(index.sprint);
                // ticketsCollection.insert([{
                //     sprint: index.Sprint,
                //     Ticket: 'ahoj'
                // }]);
                db.saveDatabase();

            }

            var tickets = ticketsArr.slice();
            for (var i = 0; i < tickets.length; i++) {
                //traverse through stories just downloaded
                //console.log(tickets[i][0], ' ' , index.Sprint);
                if (ticketsCollection.find({
                        '$and': [{
                            'Ticket': tickets[i][0]
                        }, {
                            'sprint': index.Sprint
                        }]
                    }).length <= 0) {
                    //tickets needs to be printed and added to DB
                    changesArr.push(tickets[i]);
                    ticketsCollection.insert([{
                        sprint: index.Sprint,
                        Ticket: tickets[i][0]
                    }]);

                }
            } //end for
            //console.log(changesArr);
            db.saveDatabase();
            //console.log('First is ' + ticketsCollection.get(1).Ticket);
            //console.log('*****************************88');
            //console.log(ticketsCollection.find( {'sprint':'31'} ));

            cb(changesArr);

        });

    }
}
