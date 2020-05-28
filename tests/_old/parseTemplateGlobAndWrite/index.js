var meta = require("../../../src/node");


var scope = null;
var include = "resources/**/*.vmt";
var wrongInclude = "resources1/**/*.vmt";
// var include = "resources/2/**/*.vmt";
var exclude = "**/*/a.txt";
var data = null;
var output = "output"
var callback = function (err, data) {
  console.log("Done");
};
var options = {};
options.exclude = exclude;
options.clean = true;
// options.log = false;

// meta.parseTemplateGlobAndWrite(include, output, options, callback);

async function all() {
  await meta.parseTemplateGlobAndWrite(include, output, options);
  console.log("FINISH");
}
all();

// meta.parseTemplateGlobAndWrite(wrongInclude, output, options, callback);