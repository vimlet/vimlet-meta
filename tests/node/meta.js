var meta = require("../../src/node");


var templates = "resources/src/test1/**/*.*";
var exclude = "resources/src/test1/excluded/**/*.*";
var data = "resources/src/data";
var output = "resources/output";

var templateRaw ='Main markdown template <%= "Im an echo" %> <%= data.name %> ';

// Parse and write to disk
 meta.parseTemplateWrite(null, templates, exclude, output, data, null, function(){console.log("Done");});
// Parse and print in screen
 // meta.parseTemplate(null, templates, exclude, data, function(template, data, result){console.log(result);});
// Parse data
// meta.parse(null, templateRaw,  data, function(result){console.log(result);});

//Command mode calls
// node index.js -i "../../tests/node/resources/src/test1" -e "../../tests/node/resources/src/test1/excluded/**/*.*" -o "../../tests/node/resources/output" -d "../../tests/node/resources/src/data"
