var commons = require("@vimlet/commons");
var chrome = "start chrome";

var meta = require("../../../src/node");
var path = require("path");

meta.parseTemplateGlobAndWrite(null, path.join(__dirname, "resources/**/*.vmt"), null, null, path.join(__dirname, "output"), null);


// Get open with chrome param
var cli = require("@vimlet/cli").instantiate();
var openAtTheEnd = false;

if (!module.parent) {
cli
.flag("-o", "--open", "Open with Chrome")
.parse(process.argv);
openAtTheEnd = cli.result.open || false;
if (openAtTheEnd) {
    var url = path.join(__dirname, "output", "index.html");
    commons.run.exec(chrome, url, __dirname, null, function() {
      console.log("Done");
    });
  }
}
