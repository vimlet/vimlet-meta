var metaBin = "../../../src/node";
var commons = require("@vimlet/commons");

commons.run.exec("node", [metaBin, "-i", "resources/**/*.vmt", "-o", "command/output"], null, null, function (error, data) {
    if (error) {
      console.error(error);
    } else {
      console.log("done!");
    }
  });

  
// commons.run.exec("node", [metaBin, "-i", "resources/**/*.vmt", "-o", "command/output", "-p"], null, null, function (error, data) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("done!");
//   }
// });
