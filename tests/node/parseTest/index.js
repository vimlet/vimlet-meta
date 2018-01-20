var meta = require("../../../src/node");
var path = require("path");

var template = "Hello i'm a template! <%= \"AWESOME!\" %>";

meta.parse(null, template, null, function(error, data) {
  console.log(data);
});

// meta.parseTemplate(null, path.join(__dirname, "resources/template1.vmt"), null, function(data) {
//   console.log(data);
// });