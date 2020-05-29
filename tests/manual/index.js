var meta = require("../../src/node");
var path = require("path");



// meta.parse(template, null, function (error, data) {
//   console.log(data);
// });
// async function parse() {
//   var res = await meta.parse(template);
//   console.log(res);
// }
// parse();


async function parseTemplate() {
  var res = await meta.parseTemplate(path.join(__dirname, "resources/index.html"));
  console.log(res);
}
parseTemplate();