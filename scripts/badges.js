var badge = require("gh-badges");
var fs = require("fs");
var path = require("path");

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var badgesDir = path.join(__dirname, "../badges");
var badgeStyle = "flat";

function createBadge(name, value, color, cb) {

    var fileName = name.toLowerCase().replace(new RegExp(" ", "g"), "-") + ".svg";

    badge({ text: [name, value], colorscheme: color, template: badgeStyle }, function (svg, err) {
        if (!err) {
            fs.writeFileSync(path.join(badgesDir, fileName), svg);
        }
        if (cb) {
            cb(err, svg)
        }
    });

}

createBadge("build", "passing", "green");

// MUST BE JUNIT XML
var reportFile = path.join(__dirname, "../tests/report.xml");

if(fs.existsSync(reportFile)) {

    var reportFileText = fs.readFileSync(reportFile).toString();
    
    parser.parseString(reportFileText, function (err, result) {
    
        var testSuites = result.testsuites.testsuite[0].$;
        var failures = parseInt(testSuites.failures);
    
        var color = failures == 0 ? "green" : "red";
        var value = failures == 0 ? "passing" : failures + " failed";
    
        createBadge("tests", value, color)
    
    });

}