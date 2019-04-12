var meta = require("../../../src/node");
var commons = require("@vimlet/commons");


var scope = null;
var include = "resources/**/*.vmt";
// var include = "resources/2/**/*.vmt";
var exclude = "**/*/a.txt";
var data = null;
var output = "output";
var options = {};
options.exclude = exclude;
options.clean = true;

console.log("PRE");

meta.parseTemplateGlobAndWriteSync(include, output, options);
console.log("DONE");
