var path = require("path");

var meta = require("../../../../src/node");
var include = path.join(__dirname, "../../source/manualTest/watch/**/*.*");
var output = path.join(__dirname, "../../output/watch");
var data = path.join(__dirname, "../../source/manualTest/data.json");

meta.watch(null, include, null, output, data, true, callback);

function callback(){
  console.log("Done");
}
