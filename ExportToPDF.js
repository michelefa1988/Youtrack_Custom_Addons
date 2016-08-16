PDFDocument = require('pdfkit');
fs = require('fs');

/**
 * Add new lines when lines are too long
 */
function polishString(str) {
    var maxLength = 30;
    var arr = str.split(" ");
    var newString = "";
    var chars = 0;

    arr.forEach(function(word) {
        chars = chars + word.length;
        if (chars >= maxLength) {
            newString += word + "\n";
            chars = 0;
        } else {
            newString += word + " ";
        }
    });
    return newString;
}
function createPDFDocument() {
    //Create a document
    doc = new PDFDocument();

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    var stream = fs.createWriteStream('out-pdf.pdf');
    doc.pipe(stream);

    stream.on('error', function(err) {
        console.log('error writing to PDF ');
        return (err);
    });
}

module.exports = {
    writetoPDF: function() {
            createPDFDocument();

            //console.log (ticketsArr);
            var y = 0;
            var j = 0;


            var tickets = ticketsArr.slice();
            while (tickets.length) {

                //map used for shortening project names
                var ProjectAliases = {
                    ZettaBox_Web_NextGen: "nxtgn",
                    ZettaBox_Web: "Web",
                    ZettaBox_WinClient: "Win",
                    ZettaBox_Services: "SRV"
                };
                var re = new RegExp(Object.keys(ProjectAliases).join("|"), "gi");


                var page = tickets.splice(0, 6);
                var ticketNo = 0;
                page.forEach(function(ticket) {

                    isLeft = ticketNo % 2;

                    if (isLeft === 0) {
                        //is left
                        x = 0;
                    } else {
                        x = 300;
                    }

                    doc.rect(x, y * 260, 250, 250)
                        .lineWidth(1)
                        .fillOpacity(1000.1);


                    //colour the ticket according to type of ticet
                    if (page[ticketNo][4] == "Bug") {
                        doc.fillAndStroke("pink", "#200");
                    }
                    if (page[ticketNo][4] == "Technical") {
                        doc.fillAndStroke("orange", "#200");
                    }
                    if (page[ticketNo][4] == "User Story") {
                        doc.fillAndStroke("#32CD32", "#200");
                    }
                    else {
                        doc.fillAndStroke("white", "#200");
                    }

                    //display Ticket number
                    doc.font('Times_New_Roman_Bold.ttf')
                        .fontSize(50)
                        .fillColor('black')
                        .text(page[ticketNo][0].replace(re, function(matched) {
                            return ProjectAliases[matched];
                        }), (x + 5), (y * 260) + 80);


                    //display Header of ticket
                    doc.fontSize(13);
                    doc.font('Times_New_Roman_Normal.ttf');
                    doc.text(polishString(page[ticketNo][5]));

                    //display story points
                    doc.font('Times_New_Roman_Normal.ttf')
                        .fontSize(30)
                        .fillColor('black')
                        .text(page[ticketNo][1], x + 200, (y * 260) + 10);


                    //display Asignee first name
                    var FullName = page[ticketNo][2].split(" ");
                    doc.font('Times_New_Roman_Normal.ttf')
                        .fontSize(20)
                        .fillColor('black')
                        .text(FullName[0], x + 10, (y * 260) + 10);

                    ticketNo++;
                    if (isLeft !== 0) {
                        y++;
                    }
                });
                y = 0;
                doc.addPage();
            }
            doc.save();
            //Finalize PDF file
            doc.end();
            return "PDF created successfully";
        } //end test function
};
