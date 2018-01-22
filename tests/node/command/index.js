var metaBin = "../../../src/node";
var commons = require("@vimlet/commons");

commons.run.exec("node", [metaBin, "-i", "**/*.vmt"], null, null, function (error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log("done!");
  }
});