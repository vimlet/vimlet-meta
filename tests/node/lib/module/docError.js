var path = require("path");

var meta = require("../../../../src/node");
var include = path.join(__dirname, "../../source/manualTest/error/error.css.vmi");
var output = path.join(__dirname, "../../output");
var data = path.join(__dirname, "../../source/manualTest/error/error.json");

meta.parseTemplateWrite(null, include, null, output, data, true, callback);

function callback(){
  console.log("Done");
}
