var path = require("path");

var meta = require("../../../../src/node");
var include = path.join(__dirname, "../../source/manualTest/simpleTemplate.js.vim");
var output = path.join(__dirname, "../../output");
var data = path.join(__dirname, "../../source/manualTest/data.json");

meta.parseTemplateWrite(null, include, null, output, data, true, callback);

function callback(){
  console.log("Done");
}
