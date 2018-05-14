var meta = require("../../../src/node");
var path = require("path");

var template = "Hello i'm a template! <%= \"AWESOME!\" %>";

meta.parse(template, null, function(error, data) {
  console.log(data);
});

// meta.parseTemplate(null, path.join(__dirname, "resources/template1.vmt"), null, function(error, data) {
//   console.log(data);
// });

// meta.parseTemplateGlob(null, path.join(__dirname, "**/*.vmt"), null, null, function(error, data) {
//   console.log(data);
// });

// meta.parseTemplateGlobAndWrite(null, path.join(__dirname, "**/*.vmt"), null, null, path.join(__dirname), null);