var meta = require("../../../src/node");
var path = require("path");

var template = "Hello i'm a template! <%= \"AWESOME!\" %>";
var template1 = "Hello i'm a template! <% template('template2.vmi'); %> Next  <% template('within/template3.vmi'); %>";

// meta.parse(template, null, function(error, data) {
//   console.log(data);
// });

// meta.parseTemplate(path.join(__dirname, "resources/template1.vmi"), null, function(error, data) {
//   console.log(data);
// });

// meta.parseTemplateGlob(path.join(__dirname, "**/*.vmt"), null, function(error, data) {
//   console.log(data);
// });

// meta.parseTemplateGlobAndWrite(path.join(__dirname, "**/*.vmt"), path.join(__dirname), null);


meta.parse(template1, {basePath:"resources"}, function(error, data) {
  console.log(data);
});