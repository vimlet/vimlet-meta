var commons = require("@vimlet/commons");
var chrome = "start chrome";

var meta = require("@vimlet/meta");
var path = require("path");

// Works but throw errors because of imported files.
// meta.parseTemplateGlobAndWrite(path.join(__dirname, "resources/**/*"), path.join(__dirname, "output"), {exclude:"resources/excluded/*"});

// Works without errors because it just parse .vmt files
meta.parseTemplateGlobAndWrite(path.join(__dirname, "resources/**/*.vmt"), path.join(__dirname, "output"), {exclude:"resources/excluded/*"});


// Get open with chrome param
// var cli = require("@vimlet/cli").instantiate();
// var openAtTheEnd = false;

// if (!module.parent) {
// cli
// .flag("-o", "--open", "Open with Chrome")
// .parse(process.argv);
// openAtTheEnd = cli.result.open || false;
// if (openAtTheEnd) {
//     var url = path.join(__dirname, "output", "index.html");
//     commons.run.exec(chrome, url, __dirname, null, function() {
//       console.log("Done");
//     });
//   }
// }
