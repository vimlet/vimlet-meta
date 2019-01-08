var metaBin = "../../../src/node";
var commons = require("@vimlet/commons");
var path = require("path");

var include = path.join(__dirname, "resources/**/*.vmt");
var output = path.join(__dirname, "output");

commons.run.exec("node", {args:[metaBin, "-i", include, "-o", output]}, function (error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log("done!");
  }
});

