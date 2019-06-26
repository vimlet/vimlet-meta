var meta = require("../../../src/node");
var path = require("path");

var template = "Hello i'm a template! <%= \"AWESOME!\" %>";
var template1 = "Hello i'm a template! <% template('template2.vmi'); %> Next  <% template('within/template3.vmi'); %>";

// meta.parse(template, null, function (error, data) {
//   console.log(data);
// });
// async function parse() {
//   var res = await meta.parse(template);
//   console.log(res);
// }
// parse();

meta.parseTemplate(path.join(__dirname, "resources/template1.vmi"), null, function(error, data) {
  console.log(data);
});
async function parseTemplate() {
  var res = await meta.parseTemplate(path.join(__dirname, "resources/template1.vmi"));
  console.log(res);
}
// parseTemplate();


// meta.parseTemplateGlob(path.join(__dirname, "**/*.vmt"), null, function(error, data) {
//   console.log(data);
// });
// async function parseTemplateGlob() {
//   var res = await meta.parseTemplateGlob(path.join(__dirname, "**/*.vmt"));
//   console.log(res);
// }
// parseTemplateGlob();

// meta.parseTemplateGlobAndWrite(path.join(__dirname, "**/*.vmt"), path.join(__dirname), null);
// async function parseTemplateGlobAndWrite() {
//   await meta.parseTemplateGlobAndWrite(path.join(__dirname, "**/*.vmt"), path.join(__dirname));
// }
// parseTemplateGlobAndWrite();




// meta.parse(template1, {basePath:"resources"}, function(error, data) {
//   console.log(data);
// });