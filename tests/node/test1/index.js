var path = require("path");
var meta = require("../../../src/node");

var input = path.join(__dirname, "input/*.vmt");
var output = path.join(__dirname, "output");
var data = null;

meta.parseTemplateWrite(null, input, null, output, data, null, function(error, data){
    error? console.log("-> Error\n" + error) : console.log("-> Done");
});