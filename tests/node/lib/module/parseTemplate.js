var path = require("path");

var meta = require("../../../../src/node");
var include = path.join(__dirname, "../../source/manualTest/simpleTemplate.js.vim");
var data = path.join(__dirname, "../../source/manualTest/data.json");


meta.parseTemplate(null, include, null, data, callback);

function callback(currentTemplate, currentData, result, argv){
  console.log(result);
}
