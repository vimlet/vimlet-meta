var metaBin = "../../../src/node";
var commons = require("@vimlet/commons");

// commons.run.exec("node", [metaBin, "-i", "**/*.vmt"], null, null, function (error, data) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("done!");
//   }
// });


// commons.run.exec("node", [metaBin, "-i", "**/*.vmt", "-h"], null, null, function (error, data) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("done!");
//   }
// });


commons.run.exec("node", [metaBin, "-i", "**/*.vmt", "-d", "resources/data.json"], null, null, function (error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log("done!");
  }
});