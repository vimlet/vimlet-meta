var meta = require("../../src/node");

//Old way
var templateOld = "resources/src/test1/main.md.vim";
var templateOld2 = "resources/src/test1/mainMeta.md.meta";
var dataOld = "resources/src/data";
var outputOld = "resources/output/old.old";
var outputOld2 = "resources/output/old2.old";

// meta.parse(templateOld, outputOld, dataOld, function(){console.log("Done");});
// meta.parse(templateOld2, outputOld2, dataOld, function(){console.log("Done");});

var templates = "resources/src/test1/**/*.*";
var exclude = "resources/src/test1/excluded/**/*.*";
var data = "resources/src/data";
var output = "resources/output";

//Old way adapted while working
// meta.parse(templateOld, "", outputOld, dataOld, null, function(){console.log("Done");});
// meta.parse(templateOld2, "", outputOld2, dataOld, null, function(){console.log("Done");});


//New way
 meta.parse(templates, exclude, output, data, null, function(){console.log("Done");});





//Command mode calls
// node index.js -i "../../tests/node/resources/src/test1" -e "../../tests/node/resources/src/test1/excluded/**/*.*" -o "../../tests/node/resources/output" -d "../../tests/node/resources/src/data"
